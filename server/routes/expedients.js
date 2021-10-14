var express = require("express");
var router = express.Router();
const Bonita = require("../model/bonita.js");
const supabase = require("../helpers/supabase");

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

  let bonitaUser = await Bonita.login();
  await bonitaUser.getProcessID("Sociedades");
  const responseBonita = await bonitaUser.postCase(transformedExpedient);
  let userMesa = await bonitaUser.getUserID("mesaentradas1");
  let currentTask = await bonitaUser.getIdTask();
  await bonitaUser.assignCase(userMesa, currentTask);
  return responseBonita;
};

/**
 * GET localhost:3000/expedients/
 * NOTE query to supabase
 */
router.get("/", async (req, res, next) => {
  try {
    let { data: expedients, error } = await supabase
      .from("expedient")
      .select("*");
    if (error) {
      throw error;
    }
    res.json(expedients);
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
router.post("/", async (req, res) => {
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
});

/* 
  // Note: Beware to set encType="multipart/form-data" on the <form />
  // POST localhost:3000/expedients/upload-estatuto
  // body { estatuto: FILE }
  router.post("/upload-estatuto", async (req, res) => {
    try {
      if (!req.files) {
        res.json({ status: false, message: "No file uploaded", publicURL: null });
      } else {
        res.json({
          status: true,
          message: "File uploaded",
          publicURL: uploadEstatuto(req, req.files.estatuto),
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
 */
module.exports = router;
