import Listado from "./ListadoExpedientes";
import { getExpedientes } from "../../services/service";

const ListadoMesaEntrada = () => {
  const expedientes = getExpedientes(0);

  return <Listado expedientes={expedientes} />;
};

export default ListadoMesaEntrada;
