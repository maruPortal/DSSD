import React from "react";
import useStyles from "./formRegistrationStyle";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Select from "@mui/material/Select";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useQuery } from "@apollo/client";
import { GET_COUNTRIES } from "../../graphql/query";

import { validateForm } from "../../helpers/validateForm";

function FormRegistration() {
  const classesForm = useStyles();
  const [paises, setPaises] = React.useState([]);

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
    paises: [],
    exportaServicios: false,
  });

  const [partner, setPartner] = React.useState({
    apellido: "",
    nombres: "",
    porcentaje: 0,
  });

  const [modalOpen, setModalOpen] = React.useState(false);

  const [aporteTotal, setAporteTotal] = React.useState(0);

  const [partners, setPartners] = React.useState([]);

  const { data, loading } = useQuery(GET_COUNTRIES);
  if (loading) {
    return <p>Loading...</p>;
  }

  const setPaisesHandler = (value) => {
    const paisUlt = value?.pop();
    if (paises.includes(paisUlt)) {
      setPaises([...paises.filter((pais) => pais !== paisUlt)]);
    } else {
      setPaises([...paises, paisUlt]);
    }
  };

  const handleClickModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    form.socios = [...partners];
    form.paises = paises.length ? [...paises] : ["Argentina"];
    console.log(form.paises);
    if (validateForm(form) && aporteTotal === 100) {
      console.log(form);
      //formatea y hace la query al back
    } else {
      console.log("error"); //msj de error
    }
  };

  const handleChange = (newValue) => {
    form.fechaCreacion = newValue;
    setValue(newValue);
  };

  const addPartner = (partner) => {
    if (aporteTotal + parseInt(partner.porcentaje) <= 100) {
      setAporteTotal(aporteTotal + parseInt(partner.porcentaje));
      setPartners([...partners, partner]);
    }
  };

  const addPartners = () => {
    addPartner(partner);
    handleModalClose();
  };

  function deletePartner(socio) {
    setAporteTotal(aporteTotal - parseInt(socio.porcentaje));
    setPartners((partners) => partners.filter((partner) => partner !== socio));
  }

  const listPartners = partners.map((socio, index) => {
    return (
      <li key={index} className={classesForm.socio}>
        {`
        ${socio.apellido}, ${socio.nombres}. Aporte: ${socio.porcentaje} %
        `}

        <Button
          variant="outlined"
          onClick={() => {
            deletePartner(socio);
          }}
        >
          Eliminar
        </Button>
      </li>
    );
  });

  return (
    <form onSubmit={onSubmitHandler} className={classesForm.form}>
      <h2 className={classesForm["text"]}>Registro de Sociedad Anonima</h2>
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

        <ul className={classesForm["socios"]}>{listPartners}</ul>

        <TextField
          select
          label="Apoderado"
          onChange={(e) => setForm({ ...form, apoderado: e.target.value })}
        >
          {partners.map((socio, index) => (
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
        <InputLabel>Pais *puede seleccionar más de uno</InputLabel>
        <Select
          id="paises"
          value={paises}
          multiple
          label="Paises"
          disabled={form.exportaServicios}
          onChange={(e) => setPaisesHandler(e.target.value)}
        >
          {data.countries.map((pais, index) => (
            <MenuItem key={index} value={pais.name}>
              <Checkbox checked={paises.includes(pais.name)} />
              {pais.name}
            </MenuItem>
          ))}
        </Select>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.exportaServicios}
                onChange={(e) => {
                  setForm({
                    ...form,
                    exportaServicios: !form.exportaServicios,
                  });
                  setPaisesHandler("Argentina");
                }}
              />
            }
            label="Exporta Servicios?"
          />
        </FormGroup>
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
