import { getUsuarioAvgTime } from "../../services/service";
import { useEffect, useState } from "react";

const UsuarioAvgTimeResult = ({usuario}) => {
  let [avgTime, setAvgTime] = useState(null);

  useEffect(() => {
    let requestExpedientes = async () => {
      if(!!usuario) {
        const usuarioAvgTime = await getUsuarioAvgTime(usuario);
        setAvgTime(usuarioAvgTime.avgTime);
      }
    };
    requestExpedientes();
  }, [usuario]);

  return (
    <h2>{avgTime}</h2>
  );
};

export default UsuarioAvgTimeResult;
