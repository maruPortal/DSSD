import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useStyles from "./listadoStyles";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";

const Listado = () => {
  const classes = useStyles();

  const expedientes = [
    {
      nombreSociedad: "DSSD 2",
      apoderado: "yo",
      domicilioLegal: "calle wallaby 42 sidney",
      domicilioReal: "calle wallaby 42 sidney",
      emailApoderado: "gaston.ambrogi@gmail.com",
      estado: "0",
      estatuto: "URL",
      paises: ["ARG", "UY", "BR"],
      socios: [
        { nombreSocio: "JoseMi", porcentajeAporte: "30" },
        { nombreSocio: "Maru", porcentajeAporte: "70" },
      ],
    },
    {
      nombreSociedad: "DSSD 12",
      apoderado: "yo",
      domicilioLegal: "calle wallaby 42 sidney",
      domicilioReal: "calle wallaby 42 sidney",
      emailApoderado: "gaston.ambrogi@gmail.com",
      estado: "0",
      estatuto: "URL",
      paises: ["ARG", "UY", "BR"],
      socios: [
        { nombreSocio: "JoseMi", porcentajeAporte: "30" },
        { nombreSocio: "Maru", porcentajeAporte: "70" },
      ],
    },
  ]; // get Expedientes

  return (
    <>
      <h2 className={classes["text"]}>Listado de expedientes</h2>
      <div key="1" className={classes["listado"]}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Asignarme</TableCell>
                <TableCell>Nombre de Sociedad</TableCell>
                <TableCell align="right">Apoderado</TableCell>
                <TableCell align="right">Domicilio Legal</TableCell>
                <TableCell align="right">Domicilio Real</TableCell>
                <TableCell align="right">Email de Apoderado</TableCell>
                <TableCell align="right">Estatuto</TableCell>
                <TableCell align="right">Estado</TableCell>
                <TableCell align="right">Paises</TableCell>
                <TableCell align="right">Socios</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expedientes.map((expediente) => (
                <TableRow
                  key={expediente.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Button align="center" startIcon={<AddBoxIcon />}></Button>
                    ¿ya lo tiene? <DoneIcon />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {expediente.nombreSociedad}
                  </TableCell>

                  <TableCell align="right">{expediente.apoderado}</TableCell>
                  <TableCell align="right">
                    {expediente.domicilioLegal}
                  </TableCell>
                  <TableCell align="right">
                    {expediente.domicilioReal}
                  </TableCell>
                  <TableCell align="right">
                    {expediente.emailApoderado}
                  </TableCell>
                  <TableCell align="right">{expediente.estatuto}</TableCell>
                  <TableCell align="right">{expediente.estado}</TableCell>
                  <TableCell align="right">
                    {expediente.paises.toString()}
                  </TableCell>
                  <TableCell align="right">
                    {`${expediente.socios[0].nombreSocio}, APORTE: ${expediente.socios[0].porcentajeAporte}%`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default Listado;
