var express = require("express");
var router = express.Router();
const Bonita = require("../model/bonita.js");
const supabase = require("../helpers/supabase");
const validateParams = require("../helpers/validateParams");
const jwtVerify = require("../helpers/jwtVerify");
const addHistoryRow = require("../helpers/addHistoryRow");
const tokenToBonitaInstance = require("../helpers/tokenToBonita");
const expedientStatuses = require("../model/expedientStatuses");
const { sendEmail, sendGridTemplates } = require("../helpers/email");
const qrCodeGenerator = require("../helpers/qrGenerator");
const fetch = require("node-fetch");
const fs = require("fs");
const { jsPDF } = require("jspdf");
const uploadFile = require("../helpers/gDrive");

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
    : null;

  let { data: expedients } = await supabase
    .from("expedient")
    .select("*")
    .eq("id", id);
  const emailApoderado = expedients[0].emailApoderado;

  if (!value) {
    // envia correcciones al apoderado
    const res = await sendEmail(emailApoderado, template, {
      correcciones: rqBody.correcciones,
      url: `http://localhost:3001/expediente/${id}`,
    });

    if (res.error) {
      return res.error;
    }
  } else {
    if (template) {
      // envia expediente al apoderado
      const res = await sendEmail(emailApoderado, template, {
        expediente: id,
      });

      if (res.error) {
        return res.error;
      }
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

    if (req.__bonitaInstance) {
      const cases = await req.__bonitaInstance.getAllCases("Sociedades");
      const caseId = cases.json[cases.json.length - 1].id;
      let updateVarRes = await req.__bonitaInstance.updateCaseVariable(
        caseId,
        "estado",
        req.body.estado
      );
    }

    res.json(expedients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** POST localhost:3000/expedients/validarMesa (OPCIONAL: ?submitAndContinue=true)
 * body:
 */
router.post(
  "/:id/asignarAUsuario",
  jwtVerify,
  tokenToBonitaInstance,
  addHistoryRow('ASIGNACION'),
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
  addHistoryRow((rq)=> {
    const varIndex = Object.keys(rq.body)
                           .findIndex((k) => k.includes("esValido") );
    const varKey = Object.keys(rq.body)[varIndex];
    const varValue = rq.body[varKey];

    return `VALIDACION ${varValue?'APROBADO':'DESAPROBADO'}`;
  }),
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
      return;
    }

    const newState =
    varKey === "esValidoEnMesa"
        ? (varValue)? expedientStatuses.NUEVO_EN_LEGALES: expedientStatuses.DESAPROBADO_EN_MESA
        : (varValue)? expedientStatuses.APROBADO_EN_LEGALES: expedientStatuses.DESAPROBADO_EN_LEGALES;
    // actualiza el estado del expediente en Supabase
    await supabase
      .from("expedient")
      .update({ estado: newState })
      .eq("id", rq.params.id);

    if (rq.__bonitaInstance) {
      // actualiza el estado del expediente en Bonita
      await rq.__bonitaInstance.updateCaseVariable(
        caseId,
        "estado",
        newState
      );
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
        return;
      }
    }

    res.send(updatedVarRes.json);
  }
);
/** POST localhost:3000/expedients/validar (OPCIONAL: ?submitAndContinue=true)
 * body:
    { "esValidoEnMesa": true, "esValidoEnLegales": true, correcciones: '....'} 
  */
router.post(
  "/:id/validacionAutomaticaLegales",
  addHistoryRow('VALIDACION APROBADO'),
  async (rq, res) => {
    const varIndex = Object.keys(rq.body).findIndex((k) =>
      k.includes("esValido")
    );
    const varKey = Object.keys(rq.body)[varIndex];
    const varValue = rq.body[varKey];
    const failedNotify = await notifyToApoderado(
      varKey,
      varValue,
      rq.params.id,
      rq.body
    );

    if (!!failedNotify) {
      res.status(500).send(failedNotify);
      return;
    }

    const newState =
    varKey === "esValidoEnMesa"
        ? (varValue)? expedientStatuses.NUEVO_EN_LEGALES: expedientStatuses.DESAPROBADO_EN_MESA
        : (varValue)? expedientStatuses.APROBADO_EN_LEGALES: expedientStatuses.DESAPROBADO_EN_LEGALES;
    // actualiza el estado del expediente en Supabase
    await supabase
      .from("expedient")
      .update({ estado: newState })
      .eq("id", rq.params.id);

    res.send({statusText:"OK"});
  }
);

router.post("/:id/notificarQR", 
addHistoryRow('MAILQR'),
async (rq, rs) => {
  let { data: expedients } = await supabase
    .from("expedient")
    .select("*")
    .eq("id", rq.params.id);
  const emailApoderado = expedients[0].emailApoderado;

  // envia link al apoderado
  sendEmail(emailApoderado, sendGridTemplates.Estampillado, {
    url:`https://boiling-bastion-89555.herokuapp.com/show/${expedients[0].hash}`
  });

  rs.json({ statusText: "OK" });
});

router.post("/:id/estampillar",
jwtVerify,
tokenToBonitaInstance,
addHistoryRow('ESTAMPILLAR'),
async (rq, rs) => {
  let { data: expedients, error } = await supabase
    .from("expedient")
    .select("*")
    .eq("id", rq.params.id);

  if (error) {
    rs.status(500).json({ error: error.message });
    return;
  }

  const resToken = await fetch(
    "https://boiling-bastion-89555.herokuapp.com/login",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: "escribano1", password: "bpm" }),
    }
  );

  if (resToken.status !== 200) {
    rs.status(resToken.status).send({ statusText: resToken.statusText });
    return;
  }

  const jsonToken = await resToken.json();
  const expedient = expedients[0];
  const { username } = rq.__jwtUserPayload;

  const resHash = await fetch(
    "https://boiling-bastion-89555.herokuapp.com/estampillar",
    {
      method: "POST",
      headers: {
        "access-token": jsonToken.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        estatuto: expedient.estatuto,
        expediente: expedient.id,
      }),
    }
  );

  const jsonHash = await resHash.json();

  if (jsonHash.mensaje === "Token inválido") {
    rs.status(503).json({ statusText: "ERROR" });
  }

  let updateExpedientHashResponse = await supabase
    .from("expedient")
    .update({ hash: jsonHash.hash, estado: expedientStatuses.ESTAMPILLADO })
    .eq("id", rq.params.id);

  if (updateExpedientHashResponse.error) {
    rs.status(500).json({ error: updateExpedientHashResponse.error.message });
  }

  if (rq.query.submitAndContinue) {
    // Note:: La tarea debe estar asignada a un usuario de lo contrario fallara
    const cases = await rq.__bonitaInstance.getAllCases("Sociedades");
    const caseId = cases.json[cases.json.length - 1].id;
    const activities = await rq.__bonitaInstance.getActivitiesOfCase(caseId);
    const activityId = activities[0].id;
    let userId = await rq.__bonitaInstance.getUserID(
      rq.__jwtUserPayload.username
    );
    const assignCaseRes = await rq.__bonitaInstance.assignCase(
      userId,
      activityId
    );


    const completeTaskRes = await rq.__bonitaInstance.completeTask(
      activityId
    );
    if (completeTaskRes.error.status === 500) {
      rs.status(500).json({
        ...completeTaskRes.error,
        statusText: `Task #${activityId} is not assigned`,
      });
      return;
    }
  }



  rs.json({ statusText: "OK", hash: jsonHash.hash });
});

router.post("/:id/drive", 
addHistoryRow('DRIVE'),
async (rq, res) => {
  let { data: expedients, error } = await supabase
    .from("expedient")
    .select("*")
    .eq("id", rq.params.id);

  if (error) {
    rs.status(500).json({ error: error.message });
    return;
  }
  const expedient = expedients[0];

  const socios = expedient.socios
    .map(JSON.parse)
    .map(
      (socio) =>
        `Socio ${socio.nombreSocio} porcentaje: ${socio.porcentajeAporte}%`
    )
    .join("\n");
  const qrCode = await qrCodeGenerator(
    `https://boiling-bastion-89555.herokuapp.com/show/${expedient.hash}`
  );
  const doc = new jsPDF();

  doc.text(`Expediente #${expedient.id}`, 10, 20);
  doc.text(`Nombre de Sociedad: ${expedient.nombreSociedad}`, 10, 30);
  doc.text(`Fecha de Creacion: ${new Date(expedient.fechaCreacion)}`, 10, 40);
  doc.text(`Socios: ${socios}`, 10, 50);
  doc.addImage(qrCode, 'png', 10, 100);

  const filePath=`/tmp/expedient_${expedient.id}.pdf`;
  doc.save(filePath);
  const responseExpedient = await uploadFile(expedient.id, fs.createReadStream(filePath));

  const {body: estatuto} = await fetch(expedient.estatuto);
  const responseEstatuto = await uploadFile(expedient.id, estatuto);

  const linksDrive = JSON.stringify({
    expedient: responseExpedient.webViewLink,
    estatuto: responseEstatuto.webViewLink
  });

  let updateLinksDriveResponse = await supabase
    .from("expedient")
    .update({ linksDrive })
    .eq("id", rq.params.id);

  if (updateLinksDriveResponse.error) {
    rs.status(500).json({ error: updateLinksDriveResponse.error.message });
    return;
  }

  res.json(linksDrive);
});
module.exports = router;
