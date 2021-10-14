import React from "react";
import useStyles from "./formRegistrationStyle";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import { Snackbar } from "@mui/material";
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

  const [form, setForm] = React.useState({
    nombreSociedad: "",
    socios: [],
    apoderado: "",
    estatuto: "",
    domicilioLegal: "",
    domocilioReal: "",
    emailApoderado: "",
    paises: [],
  });

  const [partner, setPartner] = React.useState({
    nombreSocio: "",
    porcentajeAporte: 0,
  });

  const [modalOpen, setModalOpen] = React.useState(false);

  const [aporteTotal, setAporteTotal] = React.useState(0);

  const [partners, setPartners] = React.useState([]);

  const [stateSnackbar, setStateSnackbar] = React.useState({
    open: false,
    type: "",
    message: "",
  });

  const handleCloseSnackbar = () => {
    setStateSnackbar({ ...stateSnackbar, open: false });
  };

  const { data, loading } = useQuery(GET_COUNTRIES);
  if (loading) {
    return <p>Loading...</p>;
  }

  const setPaisesHandler = (evento) => {
    if (Array.isArray(evento)) {
      setPaises(evento);
    } else {
      const {
        target: { value },
      } = evento;
      setPaises(typeof value === "string" ? value.split(",") : value);
    }
  };

  const handleClickModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    form.socios = [...partners];
    form.paises = paises.length ? [...paises] : ["Argentina"];
    if (validateForm(form) && aporteTotal === 100) {
      setStateSnackbar({
        open: true,
        type: "success",
        message: "Formulario enviado correctamente",
      });

      let formData = new FormData();
      formData.append("apoderado", form.apoderado);
      formData.append("domicilioLegal", form.domicilioLegal);
      formData.append("domicilioReal", form.domocilioReal);
      formData.append("emailApoderado", form.emailApoderado);
      // formData.append("estatuto", form.estatuto);
      // form.socios.forEach((socio) =>
      //   formData.append("socios", JSON.stringify(socio))
      // );
      // form.paises.forEach((pais) => formData.append("paises", pais));

      formData.append("nombreSociedad", form.nombreSociedad);
      const result = await fetch("http://localhost:3000/expedients/", {
        method: "POST",
        body: formData,
      });
      console.log(result);
    } else {
      setStateSnackbar({
        open: true,
        type: "error",
        message: "fallo en la validación",
      });
    }
  };

  const addPartner = (partner) => {
    if (aporteTotal + parseInt(partner.porcentajeAporte) <= 100) {
      setAporteTotal(aporteTotal + parseInt(partner.porcentajeAporte));
      setPartners([...partners, partner]);
    }
  };

  const addPartners = () => {
    addPartner(partner);
    handleModalClose();
  };

  function deletePartner(socio) {
    setAporteTotal(aporteTotal - parseInt(socio.porcentajeAporte));
    setPartners((partners) => partners.filter((partner) => partner !== socio));
  }

  const listPartners = partners.map((socio, index) => {
    return (
      <li key={index} className={classesForm.socio}>
        {`
        ${socio.nombreSocio}. Aporte: ${socio.porcentajeAporte} %
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
    <>
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
            onChange={(e) =>
              setForm({ ...form, nombreSociedad: e.target.value })
            }
          />

          <div>
            <Button onClick={handleClickModalOpen}>Agregar Socio</Button>
            <Dialog open={modalOpen} onClose={handleModalClose}>
              <DialogTitle>
                <h4 className={classesForm["text"]}>Agregar socio</h4>
              </DialogTitle>
              <DialogContent>
                <TextField
                  id="nombreSocio"
                  label="Nombre Completo"
                  onChange={(e) =>
                    setPartner({ ...partner, nombreSocio: e.target.value })
                  }
                />

                <TextField
                  id="porcentajeAporte"
                  label="Porcentaje de aportes"
                  type="number"
                  onChange={(e) =>
                    setPartner({ ...partner, porcentajeAporte: e.target.value })
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
              <MenuItem value={socio.nombreSocio} key={index}>
                {`${socio.nombreSocio}`}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="Estatuto"
            label="Estatuto"
            type="file"
            onChange={(e) => setForm({ ...form, estatuto: e.target.files[0] })}
            focused
            inputProps={{ accept: ".pdf, .docx, .odt" }}
          />

          <TextField
            id="DomicilioLegal"
            label="Domicilio legal"
            onChange={(e) =>
              setForm({ ...form, domicilioLegal: e.target.value })
            }
          />
          <TextField
            id="DomicilioReal"
            label="Domicilio real"
            onChange={(e) =>
              setForm({ ...form, domocilioReal: e.target.value })
            }
          />

          <TextField
            id="emailApoderado"
            label="Correo electrónico"
            type="email"
            onChange={(e) =>
              setForm({ ...form, emailApoderado: e.target.value })
            }
          />
          <InputLabel>Pais *puede seleccionar más de uno</InputLabel>
          <Select
            id="paises"
            value={paises}
            multiple
            label="Paises"
            disabled={form.exportaServicios}
            renderValue={(selected) => selected.join(",")}
            onChange={(e) => setPaisesHandler(e.target.value)}
          >
            {data.countries.map((pais, index) => (
              <MenuItem key={index} value={pais.name}>
                <Checkbox checked={paises.includes(pais.name)} />
                {pais.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <div key="9" className={classesForm["form__submit-button"]}>
          <Button key="7" type="submit">
            <h4 className={classesForm["text"]}>REGISTRAR</h4>
          </Button>
        </div>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={stateSnackbar.open}
        onClose={handleCloseSnackbar}
        message={stateSnackbar.message}
      />
    </>
  );
}

export default FormRegistration;
