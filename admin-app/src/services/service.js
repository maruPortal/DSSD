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

export const getExpedientes = async (estado) => {
  const result = await fetch(
    `http://localhost:3002/expedients/?estado=${estado}`
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
