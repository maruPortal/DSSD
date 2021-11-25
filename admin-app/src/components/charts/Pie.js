import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { getEstados } from "../../services/service";

const labelCode = {
  "-5": "EXPIRADO",
  "-2": "DESAPROBADO EN LEGALES",
  "-1": "DESAPROBADO EN MESA",
  0: "NUEVO SIN VALIDAR",
  1: "APROBADO EN MESA",
  2: "NUEVO EN LEGALES",
  3: "APROBADO EN LEGALES",
  4: "ESTAMPILLADO",
  5: "CORREGIDO PARA MESA",
  6: "CORREGIDO PARA LEGALES",
};

const PieChart = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const [estados, setEstados] = useState({});

  useEffect(() => {
    async function getExp() {
      const data = await getEstados();
      setEstados(data);
    }
    getExp();
  }, []);

  const data = {
    labels: Object.keys(estados).map((estado) => {
      return labelCode[estado];
    }),
    datasets: [
      {
        label: "# de Expedientes",
        data: Object.values(estados),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ width: 400 }}>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
