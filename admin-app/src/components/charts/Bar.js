import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getValidAndInvalid } from "../../services/service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [historial, setHistorial] = useState({});

  useEffect(() => {
    async function getExp() {
      const validInvalid = await getValidAndInvalid();
      let obj = {
        legales: {
          aprobado: 0,
          desaprobado: 0,
        },
        mesaEntrada: {
          aprobado: 0,
          desaprobado: 0,
        },
      };

      Object.keys(validInvalid).forEach((user) => {
        if (user.includes("legales")) {
          obj["legales"].aprobado = validInvalid[user].filter(
            (entry) => !entry.descripcion.includes("DESAPROBADO")
          ).length;
          obj["legales"].desaprobado = validInvalid[user].filter((entry) =>
            entry.descripcion.includes("DESAPROBADO")
          ).length;
        }
        if (user.includes("mesa")) {
          obj["mesaEntrada"].aprobado = validInvalid[user].filter(
            (entry) => !entry.descripcion.includes("DESAPROBADO")
          ).length;
          obj["mesaEntrada"].desaprobado = validInvalid[user].filter((entry) =>
            entry.descripcion.includes("DESAPROBADO")
          ).length;
        }
      });
      setHistorial(obj);
    }
    getExp();
  }, []);

  const labels = ["Mesa de Entradas", "Legales"];

  const data = {
    labels,
    datasets: [
      {
        label: "APROBADO",
        data: [historial?.mesaEntrada?.aprobado, historial?.legales?.aprobado],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "DESAPROBADO",
        data: [
          historial?.mesaEntrada?.desaprobado,
          historial?.legales?.desaprobado,
        ],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };

  return (
    <div style={{ width: 600 }}>
      <Bar options={options} data={data} />;
    </div>
  );
};

export default BarChart;
