//Variables iniciales
const fetch = require("node-fetch");
const USERNAME = "guest";
const PASSWORD = "bpm";
const url = "http://localhost:8080/bonita/";
const getCookies = (response) => response.headers.get("set-cookie").split(", ");
const getSession = (cookie) => cookie[1].split("; ")[0].split("=")[1];
const getBonitaAPIToken = (cookie) => cookie[2].split("; ")[0].split("=")[1];
const contrato = { apoderado: "pepito", domicilioLegal: "prueba" };
const CONTENT_TYPE = {
  JSON: "application/json",
};
/////////////FORMATO DE LAS VARIABLES/////////

class Bonita {
  constructor(res) {
    let cookies = getCookies(res);
    this.session = getSession(cookies);
    this.bonitaTokenAPI = getBonitaAPIToken(cookies);
    this.processID = false;
  }
  ///Metodos Login
  get cookies() {
    return `bonita.tenant=1; BOS_Locale=es; JSESSIONID=${this.session}`;
  }
  get headers() {
    return {
      Cookie: this.cookies,
      "Content-Type": CONTENT_TYPE.JSON,
      "X-Bonita-API-Token": this.bonitaTokenAPI,
    };
  }

  static async login(username = USERNAME, password = PASSWORD) {
    let params = new URLSearchParams();
    let method = "POST";
    params.append("username", username);
    params.append("password", password);
    params.append("redirect", false);
    try {
      const res = await fetch(`${url}loginservice`, {
        method: method,
        body: params,
      });

      if(res.status === 401) {
        throw { status: res.status, statusText: res.statusText }
      }

      return {bonitaUser: new Bonita(res)};
    } catch (error) {
      return {error};
    }
  }
  ///Metodos Procesos
  // async getAllProcesses() {
  //   return await fetch(`${url}API/bpm/process?c=10&p=0`, {
  //     headers: this.headers,
  //   }).then((res) => res.json());
  // }
  async getProcess(name) {
    return await fetch(`${url}API/bpm/process?s=${name}`, {
      headers: this.headers,
    }).then((res) => res.json());
  }

  async getProcessID(name) {
    let resultado = await this.getProcess(name);
    this.processID = resultado[0].id;
  }

  // initiateProcess() {
  //   let object = { processDefinitionId: this.processID };
  //   return fetch(`${url}API/bpm/case`, {
  //     headers: this.headers,
  //     method: "POST",
  //     body: JSON.stringify(object),
  //   }).then((res) => res.json());
  // }

  // ///param son las variables que vienen del form, habria que hacer un map para adaptar al formato que espera la API
  postCase(params) {
    return fetch(`${url}API/bpm/case`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        processDefinitionId: this.processID,
        variables: params,
      }),
    }).then((res) => res.json());
  }

  //https://documentation.bonitasoft.com/bonita/2021.1/bpm-api#_search_for_a_case
  // de aca se obtiene el caseID para getActivitiesOfCase y updateCaseVariable
  async getAllCases(name) {
    const res = await fetch(`${url}API/bpm/case?f=name=${name}`, {
      headers: this.headers
    });
    const json = await res.json();
    return {json, error: {status: res.status, statusText: res.statusText}};
  }

  //https://documentation.bonitasoft.com/bonita/2021.1/bpm-api#_search_among_activities
  // de aca se toma el ID de la tarea/actividad para enviar al metodo completeTask
  // 1 rootCaseID tiene solo 1 actividad en curso
  async getActivitiesOfCase(caseId) {
    const res = await fetch(`${url}API/bpm/activity?f=rootCaseId=${caseId}&d=assigned_id`, {
      headers: this.headers
    });
    return res.json();
  }

  //https://documentation.bonitasoft.com/bonita/2021.1/bpm-api#_update_a_task
  async completeTask(taskId) {
    const res = await fetch(`${url}API/bpm/task/${taskId}`, {
      headers: this.headers,
      method: "PUT",
      body: JSON.stringify({ "state": "completed" })
    });
    const error = {status: res.status, statusText: res.statusText};
    const json = res.status === 200 ? {statusText: res.statusText}: null;
    return {json, error};
  }

  // https://documentation.bonitasoft.com/bonita/2021.1/bpm-api#_get_a_case_variable
  async getCaseVariable(caseId, variableName) {
    const res = await fetch(`${url}API/bpm/caseVariable/${caseId}/${variableName}`, {
      headers: this.headers,
    });
    const json = await res.json();
    return {json};
  }


  // https://documentation.bonitasoft.com/bonita/2021.1/bpm-api#_update_a_case_variable
  async updateCaseVariable(caseId, variableName, value) {
    let javaType;

    switch (true) {
      case (typeof value === 'boolean'):
        javaType = 'java.lang.Boolean';
        break;
      case (Number.isInteger(value)):
        javaType = 'java.lang.Integer';
        break;
      case (/^\d+\.\d+$/.test(value)):
        javaType='java.lang.Long';
        break;
        case (Date.parse(value)):
          javaType='java.util.Date';
          break;
      default:
        javaType='java.lang.String';
        break;
    }

    const res = await fetch(`${url}API/bpm/caseVariable/${caseId}/${variableName}`, {
      headers: this.headers,
      method: "PUT",
      body: JSON.stringify({ type: javaType, value: `${value}` }),
    });
    const error = {status: res.status, statusText: res.statusText};
    const json = {statusText: res.statusText};
    return {json, error};
  }

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
    return fetch(`${url}API/bpm/userTask/${idTask}`, {
      headers: this.headers,
      method: "PUT",
      body: JSON.stringify({
        assigned_id: idUser,
      }),
    });
  }
//   /*
// finalizo instancia
// POST
// http://localhost:8080/bonita/API/bpm/userTask/60064_idTask/execution
// esto hace que pase a la siguiente etapa

// OTROS ENDPOINTS DE INTERES
// API/identity/user?p=0&c=5 me trae los usuarios, asi me quedo con su id
// */

//   executeTask(idTask) {
//     return fetch(`${url}API/bpm/userTask/${idTask}/execution`, {
//       headers: this.headers,
//       method: "POST",
//     });
//   }
  ///Metodos Usuarios

  getAllUsers() {
    return fetch(`${url}API/identity/user?p=0&c=5`, {
      headers: this.headers,
    }).then((res) => res.json());
  }
  async getUser(name) {
    return await fetch(`${url}API/identity/user?s=${name}`, {
      headers: this.headers,
    }).then((res) => res.json());
  }

  async getUserID(name) {
    let resultado = await this.getUser(name);
    return resultado[0].id;
  }
  //Metodo de tasks
  async getIdTask() {
    let response = await fetch(
      `${url}API/bpm/task?c=10&p=0&f=processId=${this.processID}&o=state`,
      {
        headers: this.headers,
      }
    ).then((res) => res.json());
    return response[0].id;
  }
  ///Test de logueo y get de procesos
  // static async testAll() {
  //   let bonitaUser = await Bonita.login();
  //   await bonitaUser.getProcessID("Sociedades");
  //   await bonitaUser.postCase(variables);
  //   let userMesa = await bonitaUser.getUserID("mesaentradas1");
  //   let currentTask = await bonitaUser.getIdTask();
  //   await bonitaUser.assignCase(userMesa, currentTask);
  //   await bonitaUser.executeTask(currentTask);
  // }
}

module.exports = Bonita;
