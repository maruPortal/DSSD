var express = require("express");
var router = express.Router();
const Bonita = require("../model/bonita.js");
const supabase = require("../helpers/supabase");
const validateParams = require("../helpers/validateParams");
const jwtVerify = require("../helpers/jwtVerify");
const tokenToBonitaInstance = require("../helpers/tokenToBonita");
const expedientStatuses = require("../model/expedientStatuses");
const { sendEmail, sendGridTemplates } = require("../helpers/email");

/**
 * Receives a file (BLOB) returns a public url of that file saved in `public/uploads/estatutos/`
 */
const uploadEstatuto = (req, estatuto) => {
  // upload file with unique name
  let timestamp = +new Date();
  let newFilename = `./public/uploads/estatutos/${timestamp}_estatuto_${estatuto.name}`;
  estatuto.mv(newFilename);

  //generate public url
  return `${req.protocol}://${req.get("host")}${newFilename.replace(
    "./public",
    ""
  )}`;
};

/**
 * Receives:
 *   expedient: Supabase insert result
 * Returns:
 *   Bonita response of bonita.postCase({...})
 */
const setExpedientToBonita = async (expedient) => {
  // EXAMPLE:
  // const newExpedient = [
  //   { name: "apoderado", value: "pepito" },
  //   { name: "domicilioLegal", value: "calle" },
  //   {
  //     name: "socios",
  //     value: [
  //       { nombreSocio: "JoseMi", porcentajeAporte: "30" },
  //       { nombreSocio: "Maru", porcentajeAporte: "70" },
  //     ],
  //   },
  //   { name: "paises", value: ["Argentina", "Brasil"] },
  //   { name: "esValidoEnMesa", value: new Boolean(true) },
  // ];

  const transformedExpedient = Object.keys(expedient).map((key) => {
    if (Array.isArray(expedient[key])) {
      value = expedient[key];
    } else {
      if (key === "estado") {
        value = new Boolean(value);
      } else {
        value = `${expedient[key]}`;
      }
    }

    return {
      name: key,
      value,
    };
  });

  let { bonitaUser } = await Bonita.login();
  await bonitaUser.getProcessID("Sociedades");
  const responseBonita = await bonitaUser.postCase(transformedExpedient);
  // vvv THIS IS NOT OK vvv
  // let userMesa = await bonitaUser.getUserID("mesaentradas1");
  // let currentTask = await bonitaUser.getIdTask();
  // await bonitaUser.assignCase(userMesa, currentTask);
  return responseBonita;
};

const notifyToApoderado = async (
  key,
  value,
  id,
  rqBody,
  caseId,
  bonitaInstance
) => {
  const template = !value
    ? key === "esValidoEnMesa"
      ? sendGridTemplates.CorreccionesMesa
      : sendGridTemplates.CorreccionesLegales
    : key === "esValidoEnMesa"
    ? sendGridTemplates.AprobadoMesa
    : sendGridTemplates.AprobadoLegales;

  let { data: expedients } = await supabase
    .from("expedient")
    .select("*")
    .eq("id", id);
  const emailApoderado = expedients[0].emailApoderado;

  if (!value) {
    //TODO: Send `correcciones` por email to apoderado
    // envia correcciones al apoderado
    const res = await sendEmail(emailApoderado, template, {
      correcciones: rqBody.correcciones,
      url: `http://localhost:3001/expediente/${id}`,
    });

    if (res.error) {
      return res.error;
    }
  } else {
    // envia expediente al apoderado
    const res = await sendEmail(emailApoderado, template, {
      expediente: id,
    });

    if (res.error) {
      return res.error;
    }

    const newState =
      key === "esValidoEnMesa"
        ? expedientStatuses.APROBADO_EN_MESA
        : expedientStatuses.APROBADO_EN_LEGALES;
    // actualiza el estado del expediente en Supabase
    let { error } = await supabase
      .from("expedient")
      .update({ estado: newState })
      .eq("id", id);
    // actualiza el estado del expediente en Bonita
    let updateVarRes = await bonitaInstance.updateCaseVariable(
      caseId,
      "estado",
      newState
    );

    if (error) {
      return error;
    }
  }
};

/**
 * GET localhost:3000/expedients/?estado=0
 * NOTE query to supabase
 */
router.get("/", async (req, res, next) => {
  let filters = [];
  if (Object.keys(req.query).length > 0) {
    Object.keys(req.query).map((key) => {
      filters.push({ key, val: req.query[key] });
    });
  }

  const supabaseQuery = supabase.from("expedient").select("*");

  if (filters.length > 0) {
    filters.forEach((filter) => {
      supabaseQuery.eq(filter.key, filter.val);
    });
  }

  try {
    let { data: expedients, error } = await supabaseQuery;
    if (error) {
      throw error;
    }
    res.json(expedients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET localhost:3000/expedients/50
 * NOTE query to supabase
 */
router.get("/:id", async (req, res, next) => {
  try {
    let { data: expedients, error } = await supabase
      .from("expedient")
      .select("*")
      .eq("id", req.params.id);

    if (error) {
      throw error;
    }
    if (expedients.length > 0) {
      res.json(expedients);
    } else {
      res.status(404).json(expedients);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST localhost:3000/expedients/
 * Note: Beware to set encType="multipart/form-data" on the <form />
 * NOTE Inserts expedient into Supabase
 * body:
{
  "nombreSociedad": "DSSD 2",
  "apoderado": "yo",
  "domicilioLegal": "calle wallaby 42 sidney",
  "domicilioReal": "calle wallaby 42 sidney",
  "emailApoderado": "gaston.ambrogi@gmail.com",
  "estado": "0",
  "estatuto": "URL",
  "paises": ["ARG","UY","BR"],
  "socios": [
    { nombreSocio: "JoseMi", porcentajeAporte: "30" },
    { nombreSocio: "Maru", porcentajeAporte: "70" },
  ]
}

files: {
  estatuto: FILE
}
*/
router.post(
  "/",
  validateParams([
    {
      param_key: "nombreSociedad",
      type: "string",
      required: true,
      validator_functions: [
        {
          fn: (param) => param !== "",
          message: `Missing parameter nombreSociedad`,
        },
      ],
    },
    {
      param_key: "apoderado",
      type: "string",
      required: true,
      validator_functions: [
        {
          fn: (param) => param !== "",
          message: `Missing parameter apoderado`,
        },
      ],
    },
    {
      param_key: "domicilioLegal",
      type: "string",
      required: true,
      validator_functions: [
        {
          fn: (param) => param !== "",
          message: `Missing parameter domicilioLegal`,
        },
      ],
    },
    {
      param_key: "domicilioReal",
      type: "string",
      required: true,
      validator_functions: [
        {
          fn: (param) => param !== "",
          message: `Missing parameter domicilioReal`,
        },
      ],
    },
    {
      param_key: "emailApoderado",
      type: "string",
      required: true,
      validator_functions: [
        {
          fn: (param) => param !== "",
          message: `Missing parameter emailApoderado`,
        },
      ],
    },
    // {
    //   param_key: "socios",
    //   type: "object",
    //   required: true,
    //   validator_functions: [
    //     {
    //       fn: (param) => {
    //         const sumPercentAssociates = param
    //           .map(JSON.parse)
    //           .reduce(
    //             (acc, associate) => acc + Number(associate.porcentajeAporte),
    //             0
    //           );
    //         return sumPercentAssociates === 100;
    //       },
    //       message: `Field porcentajeAporte on socios param should summarize 100%`,
    //     },
    //   ],
    // },
    {
      param_key: "estatuto",
      required: true,
      req_attr: "files",
      type: "object",
      validator_functions: [
        {
          fn: (param) => {
            const validMimeTypes = [
              "application/pdf",
              "application/vnd.oasis.opendocument.text",
              "application/msword",
            ];
            return validMimeTypes.includes(param.mimetype);
          },
          message: `Invalid parameter emailApoderado`,
        },
      ],
    },
  ]),
  async (req, res) => {
    try {
      let tmpExpedient = { ...req.body };

      tmpExpedient.estatuto = uploadEstatuto(req, req.files.estatuto);

      tmpExpedient.socios = Array.isArray(tmpExpedient.socios)
        ? tmpExpedient.socios
        : [tmpExpedient.socios];

      tmpExpedient.paises = Array.isArray(tmpExpedient.paises)
        ? tmpExpedient.paises
        : [tmpExpedient.paises];

      const {
        body: [expedient],
        error,
      } = await supabase.from("expedient").insert([tmpExpedient]);
      if (error) {
        res.status(500).json(error);
        return;
      }

      const responseBonita = await setExpedientToBonita(expedient);
      if (!responseBonita) {
        res.status(500).json({ responseBonita });
        return;
      }

      res.json(expedient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * PUT localhost:3000/expedients/50
 * NOTE updates expedient into Supabase
 * body:
  { estado: 0 }
 */
router.put("/:id", jwtVerify, tokenToBonitaInstance, async (req, res, next) => {
  try {
    let { data: expedients, error } = await supabase
      .from("expedient")
      .update(req.body)
      .eq("id", req.params.id);

    if (error) {
      throw error;
    }
    if (expedients.length === 0) {
      res.status(404).json(expedients);
      return;
    }

    const cases = await req.__bonitaInstance.getAllCases("Sociedades");
    const caseId = cases.json[cases.json.length - 1].id;
    let updateVarRes = await req.__bonitaInstance.updateCaseVariable(
      caseId,
      "estado",
      req.body.estado
    );

    res.json(expedients);
    // TODO:: send data to bonita
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** POST localhost:3000/expedients/validarMesa (OPCIONAL: ?submitAndContinue=true)
 * body:
 */
router.post(
  "/asignarAUsuario",
  jwtVerify,
  tokenToBonitaInstance,
  async (rq, res) => {
    const cases = await rq.__bonitaInstance.getAllCases("Sociedades");
    const caseId = cases.json[cases.json.length - 1].id;

    let userId = await rq.__bonitaInstance.getUserID(
      rq.__jwtUserPayload.username
    );
    const activities = await rq.__bonitaInstance.getActivitiesOfCase(caseId);
    const activityId = activities[0].id;
    const assignCaseRes = await rq.__bonitaInstance.assignCase(
      userId,
      activityId
    );

    res.send(assignCaseRes.json);
  }
);

/** POST localhost:3000/expedients/validar (OPCIONAL: ?submitAndContinue=true)
 * body:
    { "esValidoEnMesa": true, "esValidoEnLegales": true, correcciones: '....'} 
  */
router.post(
  "/:id/validar",
  jwtVerify,
  tokenToBonitaInstance,
  async (rq, res) => {
    const cases = await rq.__bonitaInstance.getAllCases("Sociedades");
    const caseId = cases.json[cases.json.length - 1].id;
    const varIndex = Object.keys(rq.body).findIndex((k) =>
      k.includes("esValido")
    );
    const varKey = Object.keys(rq.body)[varIndex];
    const varValue = rq.body[varKey];
    const updatedVarRes = await rq.__bonitaInstance.updateCaseVariable(
      caseId,
      varKey,
      varValue
    );

    const failedNotify = await notifyToApoderado(
      varKey,
      varValue,
      rq.params.id,
      rq.body,
      caseId,
      rq.__bonitaInstance
    );
    if (!!failedNotify) {
      res.status(500).send(failedNotify);
    }

    if (rq.query.submitAndContinue) {
      // Note:: La tarea debe estar asignada a un usuario de lo contrario fallara
      const activities = await rq.__bonitaInstance.getActivitiesOfCase(caseId);
      const activityId = activities[0].id;
      const completeTaskRes = await rq.__bonitaInstance.completeTask(
        activityId
      );
      if (completeTaskRes.error.status === 500) {
        res.status(500).json({
          ...completeTaskRes.error,
          statusText: `Task #${activityId} is not assigned`,
        });
      }
    }

    res.send(updatedVarRes.json);
  }
);

module.exports = router;
