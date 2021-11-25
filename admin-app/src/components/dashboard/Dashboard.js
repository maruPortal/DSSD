import ExpedienteAvgTimeSelect from "./ExpedienteAvgTimeSelect";
import ExpedienteAvgTimeResult from "./ExpedienteAvgTimeResult";

import UsuarioAvgTimeSelect from "./UsuarioAvgTimeSelect";
import UsuarioAvgTimeResult from "./UsuarioAvgTimeResult";

import PieChart from "../charts/Pie.js";
import BarChart from "../charts/Bar.js";

import { useState } from "react";
import "./dashboard.css";

const Dashboard = (props) => {
  let [idExpediente, setIdExpediente] = useState(null);
  let [usuario, setUsuario] = useState(null);

  return (
    <div className="dashboard">
      <div className="dashboard__section">
        <h4>Tiempo promedio de operacion del Expediente</h4>
        <ExpedienteAvgTimeSelect
          onExpedienteSelected={(idExpediente) => setIdExpediente(idExpediente)}
        />
        <ExpedienteAvgTimeResult idExpediente={idExpediente} />
      </div>

      <div className="dashboard__section">
        <h4>Tiempo promedio de actividad del Usuario</h4>
        <UsuarioAvgTimeSelect
          onUsuarioSelected={(usuario) => setUsuario(usuario)}
        />
        <UsuarioAvgTimeResult usuario={usuario} />
      </div>
      <div className="dashboard__section">
        <h4>Cantidad de expedientes según su estado</h4>
        <PieChart />
      </div>
      <div className="dashboard__section">
        <h4>Cantidad de expedientes aprobados según área</h4>
        <BarChart />
      </div>
    </div>
  );
};

export default Dashboard;
