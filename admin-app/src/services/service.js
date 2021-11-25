export const loginUser = async (user) => {
  const result = await fetch("http://localhost:3002/bonita/loginAs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return result; // {token:tok}
};

export const getExpedientes = async (estado=null) => {
  const result = await fetch(
    `http://localhost:3002/expedients/${estado?`?estado=${estado}`:''}`
  );

  const jsonResponse = await result.json();
  return jsonResponse;
};

export const validarExpediente = async (idExpediente, body) => {
  const token = localStorage.getItem("token");
  const result = await fetch(
    `http://localhost:3002/expedients/${idExpediente}/validar?submitAndContinue=true`,
    {
      method: "POST",
      headers: { auth: token, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  return result;
};
// error cuando quieren validar sin antes tener asignado
// {
//   "status": 500,
//   "statusText": "Task #80073 is not assigned"
// }

export const asignarExpediente = async (idExpediente) => {
  const token = localStorage.getItem("token");
  const result = await fetch(
    `http://localhost:3002/expedients/${idExpediente}/asignarAUsuario`,
    {
      method: "POST",
      headers: { auth: token },
    }
  );

  return result;
};
export const estampillarExpediente = async (idExpediente) => {
  const token = localStorage.getItem("token");
  const result = await fetch(
    `http://localhost:3002/expedients/${idExpediente}/estampillar?submitAndContinue=true`,
    {
      method: "POST",
      headers: { auth: token },
    }
  );

  return result;
};

export const putExpediente = async (idExpediente, formData) => {
  return await fetch(`http://localhost:3002/expedients/${idExpediente}`, {
    method: "PUT",
    body: formData,
  });
};

export const getExpediente = async (idExpediente) => {
  const result = await fetch(
    `http://localhost:3002/expedients/${idExpediente}`
  );
  const jsonResponse = await result.json();
  return jsonResponse[0];
};

export const getExpedienteAvgTime = async (idExpediente) => {
  const result = await fetch(
    `http://localhost:3002/stats/avgTime/${idExpediente}`
  );
  const jsonResponse = await result.json();
  return jsonResponse;
};

export const getUsuarioAvgTime = async (usuario) => {
  const result = await fetch(
    `http://localhost:3002/stats/userAvgTime/${usuario}`
  );
  const jsonResponse = await result.json();
  return jsonResponse;
};
