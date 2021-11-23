import * as React from "react";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useStyles from "./listadoStyles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Button from "@mui/material/Button";
import { generatePath, useHistory } from "react-router";
import { asignarExpediente, validarExpediente, estampillarExpediente } from "../../services/service";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const ListadoExpedientes = ({ expedientes, onReload, validationKey, hideValidationActions, showStampActions }) => {
  const classes = useStyles();
  const history = useHistory();

  const [modalOpen, setModalOpen] = useState({show:false, expediente:null, correcciones: null});

  const handleClickModalOpen = (expediente) => {
    setModalOpen({show: true, expediente});
  };

  const handleModalClose = () => {
    setModalOpen({show: false, expediente: null});
  };


  const [snackbar, setStateSnackbar] = useState({
    open: false,
    type: "",
    message: "",
  });

  const onCloseSnackbar = () => {
    setStateSnackbar({ ...snackbar, open: false });
  };

  const validarExp = async (idExpediente, esValido, correcciones) => {
    //si es false muestra modal con input para correcciones

    const body = {
      [validationKey]: esValido,
      ...!esValido?({correcciones}):{}
    }
    const validado = await validarExpediente(idExpediente, body);

    if(validado.status === 500) {
      setStateSnackbar({
        open: true,
        type: "error",
        message: `El expediente #${idExpediente} debe ser asignado previamente`,
      });
    } else {
      setStateSnackbar({
        open: true,
        type: "success",
        message: `Expediente #${idExpediente} notificado correctamente`,
      });
      onReload();
    }

  };

  const sendCorrecciones = () => {
    validarExp(modalOpen.expediente.id, false, modalOpen.correcciones);
    handleModalClose();
  }

  const updateCorrecciones = (correcciones) => {
    setModalOpen((prevState) => {
      return {
        ...prevState, correcciones
      }
    })
  }

  const asignarExp = async (idExpediente) => {
    await asignarExpediente(idExpediente);

    setStateSnackbar({
      open: true,
      type: "success",
      message: `Expediente #${idExpediente} asignado`,
    });
  };
  const estampillarExp = async (idExpediente) => {
    const result = await estampillarExpediente(idExpediente);

    setStateSnackbar({
      open: true,
      type: "success",
      message: `Expediente #${idExpediente} estampillado`,
    });
    onReload();
  };
  return (
    <>
      <Dialog open={modalOpen.show} onClose={handleModalClose}>
        <DialogTitle>
          Correcciones
          {/* <span className={classesForm["text"]}></span> */}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="correcciones"
            multiline
            rows={4}
            label="Correcciones"
            placeholder="Correcciones"
            onChange={(e) => updateCorrecciones(e.target.value) }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancelar</Button>
          <Button onClick={sendCorrecciones}>Enviar Correcciones</Button>
        </DialogActions>
      </Dialog>


      <h2 className={classes["text"]}>Listado de expedientes</h2>
      <div key="1" className={classes["listado"]}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Acciones</TableCell>
                {/* <TableCell align="center">Ver más</TableCell> */}

                <TableCell align="center">#Expediente</TableCell>
                <TableCell align="center">Nombre de Sociedad</TableCell>
                <TableCell align="center">Apoderado</TableCell>
                <TableCell align="center">Domicilio Legal</TableCell>
                <TableCell align="center">Domicilio Real</TableCell>
                <TableCell align="center">Email de Apoderado</TableCell>
                <TableCell align="center">Estatuto</TableCell>
                {/* <TableCell align="right">Estado</TableCell> */}
                <TableCell align="center">Paises</TableCell>
                <TableCell align="center">Socios</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expedientes.map((expediente, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <div>
                      {!hideValidationActions && (<>
                        <Button
                        variant="text"
                        align="center"
                        onClick={() => asignarExp(expediente.id)}
                      >
                        Asignar
                      </Button>
                      <Button
                        variant="text"
                        align="center"
                        background-color="white"
                        onClick={() => validarExp(expediente.id, true)}
                      >
                        Valido
                      </Button>
                      <Button
                        variant="text"
                        align="center"
                        background-color="white"
                        onClick={() => handleClickModalOpen(expediente)}
                      >
                        Invalido
                      </Button>
                      </>)}

                      {showStampActions && (<>
                        <Button
                        variant="text"
                        align="center"
                        onClick={() => estampillarExp(expediente.id)}
                      >
                        Estampillar
                      </Button>
                      </>) }
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {expediente.id}
                  </TableCell>
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
                  <TableCell align="right">
                    <a href={expediente.estatuto} target="_blank"> Estatuto </a>
                  </TableCell>
                  {/* <TableCell align="right">{expediente.estado}</TableCell> */}
                  <TableCell align="right">
                    {expediente.paises.toString()}
                  </TableCell>
                  <TableCell>
                    {
                      expediente.socios.map((socio) => {
                        return (<span key={`${socio.nombreSocio}${socio.porcentajeAporte}`}>
                          {`${socio.nombreSocio} ${socio.porcentajeAporte}%`}
                          <br/>
                        </span>)
                      })
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        onClose={onCloseSnackbar}
      >
        <Alert onClose={onCloseSnackbar} severity={snackbar.type}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ListadoExpedientes;
