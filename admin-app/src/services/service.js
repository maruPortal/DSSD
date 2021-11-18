export const loginUser = async (user) => {
  const result = await fetch("http://localhost:3000/bonita/loginAs", {
    method: "POST",
    body: user,
  });
  return result; // {token:tok}
};

export const getExpedientes = (estado) => {
  console.log(estado);
  // const result = await fetch(`localhost:3000/expedients/${estado}`, {
  //   method: "GET",
  // });

  /////////////   borrar desp - sin header
  return [
    {
      id: "1",
      nombreSociedad: "DSSD 2",
      apoderado: "yo",
      domicilioLegal: "calle wallaby 42 sidney",
      domicilioReal: "calle wallaby 42 sidney",
      emailApoderado: "asda.ambrogi@gmail.com",
      estado: "0",
      estatuto: "URL",
      paises: ["ARG", "UY", "BR"],
      socios: [
        { nombreSocio: "JoseMi", porcentajeAporte: "30" },
        { nombreSocio: "Maru", porcentajeAporte: "70" },
      ],
    },
    {
      id: "2",
      nombreSociedad: "DSSD 12",
      apoderado: "yo",
      domicilioLegal: "calle wallaby 42 sidney",
      domicilioReal: "calle wallaby 42 sidney",
      emailApoderado: "gaston.ambrogi@gmail.com",
      estado: "0",
      estatuto: "URL",
      paises: ["ARG", "UY", "BR"],
      socios: [
        { nombreSocio: "JoseMi", porcentajeAporte: "30" },
        { nombreSocio: "Maru", porcentajeAporte: "70" },
      ],
    },
  ];
  ////////////
  // return result;
};

export const validarExpediente = (idExpediente) => {
  return null;
};

export const asignarExpediente = async (idExpediente) => {
  const result = await fetch(
    `http://localhost:3000/expedients/${idExpediente}/asignarAlUsuario`,
    {
      headers: { auth: "token" }, //depende del usuario
      method: "POST",
    }
  );
  return result;
};
// POST
//localhost:3000/expedients/:idExpediente/asignarAlUsuario header {auth:token}
// devuelve {statusText: OK}

// POST
// validarrr: /expedients/:idExp/validar
// header {auth:token}
//        {esValidoEnMesa: true}
//        {esValidoEnMesa: false, correcciones: unString} //si es false se manda correcciones
//
// returna:   {statusText: OK}
//
//

// validarrr: /expedients/:idExp/validar?submitAndContinue=true
// le da un seguir en el flujo de ejecucion en bonita

//  {esValidoEnLegales: true}
//  {esValidoEnLegales: false, colecciones:unString} //idem anterior
//
//Apoderado: editar formulario de expediente
//
//
//
//

// error cuando quieren validar sin antes tener asignado
// {
//   "status": 500,
//   "statusText": "Task #80073 is not assigned"
// }
//
//
//
// desde el mail accede al editExpediente
// PUT
