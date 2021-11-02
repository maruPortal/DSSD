const Bonita = require("../model/bonita.js");
const {Headers} = require('node-fetch');

module.exports = (rq, rs, next) => {
  let mappedCookies = rq.headers.cookie.split(';').map(cookie=> `${cookie}; Path=/; HttpOnly; SameSite=Lax`);
  mappedCookies.unshift('bonita.tenant=1; SameSite=Lax');
  const headers = new Headers({'set-cookie': mappedCookies});

  rq.__bonitaInstance = new Bonita({headers});
  next();
}