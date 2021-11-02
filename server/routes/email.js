var express = require("express");
var router = express.Router();
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const templateIDs={
  CorreccionesMesa:'d-9430aa495f7b41e2aae516f97881bde5',
  CorreccionesLegales: 'd-26597769da174b208091d9c2d19ea190'
}

router.post("/", (rq,rs) => {
  const msg = {
    to: 'ambrogigaston@gmail.com', // Change to your recipient
    from: 'gaston.ambrogi@gmail.com', // Change to your verified sender
    templateId: templateIDs.CorreccionesMesa,
    dynamicTemplateData: {
      correcciones: 'Testing Templates CULO',
      url: 'http://localhost:3001/expediente/123123123123'
    },
  }
  sgMail
    .send(msg)
    .then(() => {
      rs.send('Email sent');
    })
    .catch((error) => {
      console.error(error)
    })
})

module.exports = router;