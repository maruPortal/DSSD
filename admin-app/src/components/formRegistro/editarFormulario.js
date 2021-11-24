import Form from "./Formulario";
import useStyles from "./formularioRegistroStyle";
import { useState } from "react";
import { useParams } from "react-router";
import { getExpediente, putExpediente } from "../../services/service";
import { useEffect } from "react";

const EditarFormulario = () => {
  const classesForm = useStyles();
  const { id: idExpediente } = useParams();
  const [form, setForm] = useState({});

  useEffect(() => {
    async function getExp() {
      const expediente = await getExpediente(idExpediente);
      setForm({ ...expediente, socios: expediente.socios.map(JSON.parse) });
    }
    getExp();
  }, []);

  const editarFormulario = async (formData) => {
    if (form.estado === -1) {
      formData.append("estado", "5");
    } else if (form.estado === -2) {
      formData.append("estado", "6");
    }
    const result = await putExpediente(idExpediente, formData);
    return result;
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
