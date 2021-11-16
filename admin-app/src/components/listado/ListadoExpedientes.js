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
// import ReadMoreIcon from "@mui/icons-material/ReadMore";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
// import { routes } from "../../constants/routes";
import { generatePath, useHistory } from "react-router";
import { asignarExpediente, validarExpediente } from "../../services/service";

const Listado = ({ expedientes }) => {
  const classes = useStyles();
  const history = useHistory();
  // console.log(expedientes);

  // function verExpediente(expediente) {
  //   const path = generatePath(routes.SHOWEXPEDIENTE, { id });
  //   return history.push(path);
  // }

  const validarExp = (idExpediente, esValido, correcciones) => {
    //si es false muestra modal con input para correcciones
    const validado = validarExpediente(idExpediente);
    console.log(validado, esValido, correcciones);
  };

  const asignarExp = (idExpediente) => {
    const asignado = asignarExpediente(idExpediente);
    console.log(asignado);
    //luego modificar boton ? o desaparece listado
  };
  return (
    <>
      <h2 className={classes["text"]}>Listado de expedientes</h2>
      <div key="1" className={classes["listado"]}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Asignarme</TableCell>
                <TableCell align="center">Validar</TableCell>
                {/* <TableCell align="center">Ver más</TableCell> */}

                <TableCell align="right">Nombre de Sociedad</TableCell>
                <TableCell align="right">Apoderado</TableCell>
                <TableCell align="right">Domicilio Legal</TableCell>
                <TableCell align="right">Domicilio Real</TableCell>
                <TableCell align="right">Email de Apoderado</TableCell>
                <TableCell align="right">Estatuto</TableCell>
                {/* <TableCell align="right">Estado</TableCell> */}
                <TableCell align="right">Paises</TableCell>
                <TableCell align="right">Socios</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expedientes.map((expediente, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Button
                      variant="text"
                      align="center"
                      startIcon={<AddBoxIcon />}
                      onClick={() => asignarExp(expediente.id)}
                    ></Button>
                    o <DoneIcon />
                  </TableCell>
                  <TableCell>
                    <div>
                      <Button
                        variant="text"
                        align="center"
                        headers
                        background-color="white"
                        onClick={() => validarExp(expediente.id, true)}
                      >
                        <DoneIcon />
                      </Button>
                      <Button
                        variant="text"
                        align="center"
                        background-color="white"
                        onClick={() => validarExp(expediente.id, false)}
                      >
                        <ClearIcon />
                      </Button>
                    </div>
                  </TableCell>
                  {/* <TableCell align="center">
                    <Button
                      to={showExpedient(expediente.id)}
                      startIcon={<ReadMoreIcon />}
                    ></Button>
                  </TableCell> */}
                  <TableCell align="right">
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
                  {/* <TableCell align="right">{expediente.estado}</TableCell> */}
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
