import ListadoExpedientes from "./ListadoExpedientes";
import { getExpedientes } from "../../services/service";
import { useEffect, useState } from "react";

const ListadoMesaEntrada = () => {
  let [expedientes, setExpedientes] = useState([]);
  let [reload, setReload] = useState(false);

  useEffect(() => {
    let requestExpedientes = async () => {
      const exps = await getExpedientes([0,5]);
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
      validationKey="esValidoEnMesa"
    />
  );
};

export default ListadoMesaEntrada;
