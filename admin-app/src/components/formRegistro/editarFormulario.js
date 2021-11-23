import Form from "./Formulario";
import useStyles from "./formularioRegistroStyle";
import { useState } from "react";

const EditarFormulario = () => {
  const classesForm = useStyles();

  //get de expediente
  const [form, setForm] = useState({
    id: "1",
    nombreSociedad: "DSSD 2",
    apoderado: "yo",
    domicilioLegal: "calle wallaby 42 sidney",
    domicilioReal: "calle wadddllaby 42 sidney",
    emailApoderado: "asda.ambrogi@gmail.com",
    estado: "0",
    estatuto: "URL",
    paises: ["ARG", "UY", "BR"],
    socios: [
      { nombreSocio: "JoseMi", porcentajeAporte: "30" },
      { nombreSocio: "Maru", porcentajeAporte: "70" },
    ],
  });

  const editarFormulario = async (formData) => {
    ////////////// url ?
    return await fetch("http://localhost:3000/expedients/", {
      method: "PUT",
      body: formData,
    });
  };

  return (
    <>
      <h2 className={classesForm["text"]}>Editar Sociedad Anonima</h2>

      <Form
        form={form}
        setForm={setForm}
        enviarForm={editarFormulario}
        textButton="Editar"
      />
    </>
  );
};

export default EditarFormulario;
