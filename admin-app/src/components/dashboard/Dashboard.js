import ExpedienteAvgTimeSelect from './ExpedienteAvgTimeSelect';
import ExpedienteAvgTimeResult from './ExpedienteAvgTimeResult';

import UsuarioAvgTimeSelect from './UsuarioAvgTimeSelect';
import UsuarioAvgTimeResult from './UsuarioAvgTimeResult';

import { useState } from "react";
import "./dashboard.css";

const Dashboard = (props) => {
  let [idExpediente, setIdExpediente] = useState(null);
  let [usuario, setUsuario] = useState(null);


  return ( <div className="dashboard">
    <div className="dashboard__section">
      <h4>Tiempo promedio de operacion del Expediente</h4>
      <ExpedienteAvgTimeSelect onExpedienteSelected={(idExpediente) => setIdExpediente(idExpediente)} />
      <ExpedienteAvgTimeResult idExpediente={idExpediente} />
    </div>

    <div className="dashboard__section">
      <h4>Tiempo promedio de actividad del Usuario</h4>
      <UsuarioAvgTimeSelect onUsuarioSelected={(usuario) => setUsuario(usuario)} />
      <UsuarioAvgTimeResult usuario={usuario} />
    </div>
  </div> );
}

export default Dashboard;