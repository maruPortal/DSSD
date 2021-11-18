import Listado from "./ListadoExpedientes";
import { getExpedientes } from "../../services/service";

const ListadoEscribania = () => {
  const expedientes = getExpedientes(3);
  return <Listado expedientes={expedientes} />;
};

export default ListadoEscribania;
