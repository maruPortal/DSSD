import { getExpedientes } from "../../services/service";
import Listado from "./ListadoExpedientes";

const ListadoLegales = () => {
  const expedientes = getExpedientes(2);
  return <Listado expedientes={expedientes} />;
};

export default ListadoLegales;
