import { getExpedientes } from "../../services/service";
import ListadoExpedientes from "./ListadoExpedientes";
import { useEffect, useState } from "react";

const ListadoLegales = () => {
  let [expedientes, setExpedientes] = useState([]);
  let [reload, setReload] = useState(false);

  useEffect(() => {
    let requestExpedientes = async () => {
      const exps = await getExpedientes(3);
      const newExpedientes = [];
      exps.forEach((expediente) => {
        newExpedientes.push({
          ...expediente,
          socios: expediente.socios.map(JSON.parse),
        });
      });
      setExpedientes(newExpedientes);
    };
    requestExpedientes();
  }, [reload]);

  return (
    <ListadoExpedientes
      expedientes={expedientes}
      onReload={() => setReload(!reload)}
      hideValidationActions
      showStampActions
    />
  );
};

export default ListadoLegales;
