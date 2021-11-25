import { getExpedienteAvgTime } from "../../services/service";
import { useEffect, useState } from "react";

const ExpedienteAvgTimeResult = ({idExpediente}) => {
  let [avgTime, setAvgTime] = useState(null);

  useEffect(() => {
    let requestExpedientes = async () => {
      if(!!idExpediente) {
        const expedienteAvgTime = await getExpedienteAvgTime(idExpediente);
        setAvgTime(expedienteAvgTime.avgTime);
      }
    };
    requestExpedientes();
  }, [idExpediente]);

  return (
    <h2>{avgTime}</h2>
  );
};

export default ExpedienteAvgTimeResult;
