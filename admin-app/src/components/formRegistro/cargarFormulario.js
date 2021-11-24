import Form from "./Formulario";
import useStyles from "./formularioRegistroStyle";
import { useState } from "react";

const CargarFormulario = () => {
  const classesForm = useStyles();

  const [form, setForm] = useState({
    nombreSociedad: "",
    socios: [],
    apoderado: "",
    estatuto: "",
    domicilioLegal: "",
    domocilioReal: "",
    emailApoderado: "",
    paises: [],
  });

  const crearFormulario = async (formData) => {
    return await fetch("http://localhost:3002/expedients/", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <>
      <h2 className={classesForm["text"]}>Registro de Sociedad Anonima</h2>

      <Form
        form={form}
        setForm={setForm}
        enviarForm={crearFormulario}
        textButton="Registrar"
      />
    </>
  );
};

export default CargarFormulario;
