const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendGridTemplates = {
  CorreccionesMesa: "d-9430aa495f7b41e2aae516f97881bde5",
  CorreccionesLegales: "d-26597769da174b208091d9c2d19ea190",
  AprobadoMesa: "d-de269af3b24d4e9584bb9de42956eee5",
  Estampillado: "d-cdc1cfada4db457a80ada326d1a4185f"
};

// data: { correcciones: 'Testing Templates Message', url: 'http://localhost:3001/expediente/123123123123', expediente:'123123' }
const sendEmail = async (to, templateId, dynamicTemplateData) => {
  const from = "chaston@protonmail.com";

  const res = await sgMail.send({
    to, // Change to your recipient
    from, // Change to your verified sender
    templateId,
    dynamicTemplateData,
  });

  return res;
};

module.exports = {
  sendGridTemplates,
  sendEmail,
};
