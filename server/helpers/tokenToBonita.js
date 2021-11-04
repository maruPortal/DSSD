const Bonita = require("../model/bonita.js");
const { Headers } = require("node-fetch");

module.exports = (rq, rs, next) => {
  const headers = new Headers({
    "set-cookie": `bonita.tenant=1; SameSite=Lax, JSESSIONID=${rq.__jwtUserPayload.session}; Path=/; HttpOnly; SameSite=Lax, X-Bonita-API-Token=${rq.__jwtUserPayload.bonitaTokenAPI}; Path=/; SameSite=Lax, BOS_Locale=es; Path=/; SameSite=Lax`,
  });

  rq.__bonitaInstance = new Bonita({ headers });
  next();
};
