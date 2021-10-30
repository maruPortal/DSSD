var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
const Bonita = require("../model/bonita.js");

router.post("/loginAs", async (req, res) => {
  const { username, password } = req.body;

  let { bonitaUser, error } = await Bonita.login(username, password);

  if (error) {
    res.status(error.status).json(error);
  }

  const payload = {
    ...bonitaUser,
    username,
  };
  const token = jwt.sign(payload, "BONITA_SECRET_KEY", {
    expiresIn: 1440,
  });
  res.json({ token });
});

// ///Bonita API
// router.get("/test", async (req, res, next) => {
//   const newExpedient = [
//     { name: "apoderado", value: "pepito" },
//     { name: "domicilioLegal", value: "calle" },
//     {
//       name: "socios",
//       value: [
//         { nombreSocio: "juan Perez", porcentajeAporte: "30" },
//         { nombreSocio: "carlitos", porcentajeAporte: "70" },
//       ],
//     },
//     { name: "paises", value: ["Argentina", "Brasil"] },
//     // { name: "esValidoEnMesa", value: new Boolean(true) },
//   ];

//   try {
//     let bonitaUser = await Bonita.login();
//     await bonitaUser.getProcessID("Sociedades");
//     const responseBonita = await bonitaUser.postCase(newExpedient);
//     // let userMesa = await bonitaUser.getUserID("mesaentradas1");
//     // let currentTask = await bonitaUser.getIdTask();
//     // await bonitaUser.assignCase(userMesa, currentTask);
//     //await bonitaUser.executeTask(currentTask);

//     res.json(responseBonita);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get("/efectuarValidacion", async (req, res) => {
//   const setValidacion = [{ name: "esValidoEnMesa", value: true }];
//   let bonitaUser = await Bonita.login();
//   // await bonitaUser.getProcessID("Sociedades");
//   const response = await bonitaUser.postCase(setValidacion);
//   console.log(
//     "🚀 ~ file: expedients.js ~ line 77 ~ router.get ~ response",
//     response
//   );

//   // let userMesa = await bonitaUser.getUserID("mesaentradas1");
//   // let currentTask = await bonitaUser.getIdTask();
//   // await bonitaUser.executeTask(currentTask);

//   res.json(setValidacion);
// });

module.exports = router;
