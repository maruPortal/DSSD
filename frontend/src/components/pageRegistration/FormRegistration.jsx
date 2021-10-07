import React from "react";
import useStyles from "./formRegistrationStyle";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useQuery } from "@apollo/client";
import { GET_COUNTRIES } from "../../graphql/query";

function FormRegistration() {
  const classesForm = useStyles();
  const [value, setValue] = React.useState(new Date());
  const [form, setForm] = React.useState({
    sociedad: "",
    fechaCreacion: value,
    socios: [],
    apoderado: "",
    estatuto: "",
    domicilioLegal: "",
    domocilioReal: "",
    email: "",
  });

  const [partner, setPartner] = React.useState({
    apellido: "",
    nombres: "",
    porcentaje: 0,
  });

  const [modalOpen, setModalOpen] = React.useState(false);

  let aporteTotal = 0;

  const { data, loading } = useQuery(GET_COUNTRIES, {
    onError: (e) => console.log(e),
  });

  console.log(data, loading);

  const handleClickModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const addPartners = () => {
    console.log(partner);
    addPartner(partner);
    handleModalClose();
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(form);
  };

  const handleChange = (newValue) => {
    form.fechaCreacion = newValue;
    setValue(newValue);
  };

  const addPartner = (partner) => {
    console.log(partner);
    // chequear porcentaje al 100% . no debe superarlo
    console.log(aporteTotal + partner.porcentaje <= 100);

    if (aporteTotal + partner.porcentaje <= 100) {
      //ver
      aporteTotal = aporteTotal + partner.porcentaje;
      form.socios.push(partner);
    }
  };

  const listPartners = form?.socios?.map((socio, index) => {
    return (
      <li key={index}>
        {`
        ${socio.apellido}, ${socio.nombres}. Aporte: ${socio.porcentaje} %
        `}
      </li>
    );
  });

  return (
    <form onSubmit={onSubmitHandler} className={classesForm.form}>
      <h4 className={classesForm["text"]}>Registro de Sociedad Anonima</h4>
      <Box
        sx={{
          "& .MuiTextField-root": { margin: "2%", width: "90%" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="nombreSociedad"
          label="Nombre de Sociedad"
          onChange={(e) => setForm({ ...form, sociedad: e.target.value })}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Fecha de creación"
            inputFormat="MM/dd/yyyy"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <div>
          <Button onClick={handleClickModalOpen}>Agregar Socio</Button>
          <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>
              <h4 className={classesForm["text"]}>Agregar socio</h4>
            </DialogTitle>
            <DialogContent>
              <TextField
                id="apellido"
                label="Apellido"
                onChange={(e) =>
                  setPartner({ ...partner, apellido: e.target.value })
                }
              />
              <TextField
                id="nombres"
                label="Nombres"
                onChange={(e) =>
                  setPartner({ ...partner, nombres: e.target.value })
                }
              />
              <TextField
                id="porcentajeAportes"
                label="Porcentaje de aportes"
                type="number"
                onChange={(e) =>
                  setPartner({ ...partner, porcentaje: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalClose}>Cancelar</Button>
              <Button onClick={addPartners}>Agregar Socio</Button>
            </DialogActions>
          </Dialog>
        </div>
        <ul>{listPartners}</ul>

        <TextField
          select
          label="Apoderado"
          onChange={(e) => setForm({ ...form, apoderado: e.target.value })}
          defaultValue={form.apoderado ? "" : ""}
        >
          {form.socios.map((socio, index) => (
            <MenuItem value={socio} key={index}>
              {`${socio.apellido} ${socio.nombres}`}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="Estatuto"
          label="Estatuto"
          type="file"
          onChange={(e) => setForm({ ...form, estatuto: e.target.value })}
          focused
          inputProps={{ accept: ".pdf, .docx, .odt" }}
        />

        <TextField
          id="DomicilioLegal"
          label="Domicilio legal"
          onChange={(e) => setForm({ ...form, domicilioLegal: e.target.value })}
        />
        <TextField
          id="DomicilioReal"
          label="Domicilio real"
          onChange={(e) => setForm({ ...form, domocilioReal: e.target.value })}
        />

        <TextField
          id="email"
          label="Correo electrónico"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </Box>

      <div key="9" className={classesForm["form__submit-button"]}>
        <Button key="7" type="submit">
          <h4 className={classesForm["text"]}>REGISTRAR</h4>
        </Button>
      </div>
    </form>
  );
}

export default FormRegistration;
