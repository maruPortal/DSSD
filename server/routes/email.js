var express = require("express");
var router = express.Router();
const { sendEmail, sendGridTemplates } = require("../helpers/email");

router.post("/", async (rq, rs) => {
  const res = await sendEmail(
    "ambrogigaston@gmail.com",
    sendGridTemplates.CorreccionesMesa,
    {
      correcciones: "Testing Templates Message",
      url: "http://localhost:3001/expediente/123123123123",
    }
  );
  if (res.error) {
    res.status(500).send(error);
    return;
  }
  rs.send("Email sent");
  // const msg = {
  //   to: 'ambrogigaston@gmail.com', // Change to your recipient
  //   from: 'gaston.ambrogi@gmail.com', // Change to your verified sender
  //   templateId: templateIDs.CorreccionesMesa,
  //   dynamicTemplateData: {
  //     correcciones: 'Testing Templates CULO',
  //     url: 'http://localhost:3001/expediente/123123123123'
  //   },
  // }
  // sgMail
  //   .send(msg)
  //   .then(() => {
  //     rs.send('Email sent');
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //   })
});

module.exports = router;
