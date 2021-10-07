//Variables iniciales
const { response } = require("express");
const fetch = require("node-fetch");
const USERNAME = "guest";
const PASSWORD = "bpm";
const url = "http://localhost:8080/bonita/";
const getCookies = (response) => response.headers.get("set-cookie").split(", ");
const getSession = (cookie) => cookie[1].split("; ")[0].split("=")[1];
const getBonitaAPIToken = (cookie) => cookie[2].split("; ")[0].split("=")[1];

class Bonita {
  constructor(res) {
    let cookies = getCookies(res);
    this.session = getSession(cookies);
    this.bonitaTokenAPI = getBonitaAPIToken(cookies);
    this.processID = false;
  }
  ///Metodos Login
  get cookies() {
    return `bonita.tenant=1; BOS_Locale=es; JSESSIONID=${this.session}; X-Bonita-API-Token=${this.bonitaTokenAPI}`;
  }
  get headers() {
    return { Cookie: this.cookies };
  }

  static login() {
    let params = new URLSearchParams();
    let method = "POST";
    params.append("username", USERNAME);
    params.append("password", PASSWORD);
    params.append("redirect", false);
    return fetch(`${url}loginservice`, { method: method, body: params }).then(
      (res) => new Bonita(res)
    );
  }
  ///Metodos Procesos
  getAllProcesses() {
    return fetch(`${url}API/bpm/process?c=10&p=0`, {
      headers: this.headers,
    }).then((res) => res.json());
  }
  getProcess(name) {
    return this.getAllProcesses().then((proc) =>
      proc.find((p) => p.name == name)
    );
  }

  async getProcessID(name) {
    this.processID = (await this.getProcess(name)).id;
  }

  initiateProcess() {
    let object = { processDefinitionId: this.processID };
    return fetch(`${url}API/bpm/case`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(object),
    }).then((res) => res.json());
  }

  ///param son las variables que vienen del form, habria que hacer un map para adaptar al formato que espera la API
  postCase(params) {
    return fetch(`${url}/API/bpm/case`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        processDefinitionId: this.process,
        variables: params,
      }),
    }).then((res) => res.json());
  }

  /*
Formato, definicion del proceso y luego variables con clave name y value
{
  "processDefinitionId":"6877964967564468572",
  "variables":[
    {
      "name":"apoderado",
      "value":"pepito"
    },
    {
     "name":"domicilioLegal",
      "value":"calle"
    },
    {
      "name":"domicilioReal",
      "value":"pepito"
    },
    {
      "name":"emailApoderado",
      "value":"unEmail"
    },
    {
     "name":"estatuto",
      "value":"miestatuto"
    },
    {
      "name":"nombreSociedad",
      "value":"unNombre"
    },
     {
     "name":"paises",
      "value":"mis paises"
    },
    {
      "name":"socios",
      "value":"missocios"
    }
  ]
}
  */

  /*
despues de instanciar asigno
http://localhost:8080/bonita/API/bpm/userTask/60064_idTask
PUT
{
  "assigned_id" : 102

}
el 102 es la usuario de la mesa de entrada
*/
  assignCase(idUser, idTask) {
    return fetch(`${url}/API/bpm/userTask/${idTask}`, {
      headers: this.headers,
      method: "PUT",
      body: JSON.stringify({
        assigned_id: idUser,
      }),
    }).then((res) => res.json());
  }
  /*
finalizo instancia
POST
http://localhost:8080/bonita/API/bpm/userTask/60064_idTask/execution
esto hace que pase a la siguiente etapa

OTROS ENDPOINTS DE INTERES
API/identity/user?p=0&c=5 me trae los usuarios, asi me quedo con su id
*/
  // exports.createCase = (req, res, next) => {};

  // exports.completeActivity = (req, res, next) => {};

  executeTask(idTask) {
    return fetch(`${url}/API/bpm/userTask/${idTask}/execution`, {
      headers: this.headers,
      method: "POST",
    }).then((res) => res.json());
  }
  ///Metodos Usuarios

  findUserByName(name) {
    return fetch(`${url}API/identity/user?p=0&c=5`, {
      headers: this.headers,
    }).then((users) => users.find((user) => user.name === name));
  }

  getAllUsers() {
    return fetch(`${url}API/identity/user?p=0&c=5`, {
      headers: this.headers,
    }).then((res) => res.json());
  }
  getUser(name) {
    return this.getAllUsers().then((users) =>
      users.find((user) => user.userName === name)
    );
  }

  async getUserID(name) {
    let userID = (await this.getUser(name)).id;
  }

  ///Test de logueo y get de procesos
  static async testAll() {
    let bonitaUser = await Bonita.login();
    bonitaUser.getAllProcesses();
    //let processes = await bonitaUser.getProcesses();
    //let activities = await bonitaUser.getProcess();
    //bonitaUser.getAllProcesses();
    //await bonitaUser.getProcessID("Registro de Sociedades");
    //bonitaUser.initiateProcess();
    //.getUserID("mesaentradas1");
  }
}

module.exports = Bonita;
