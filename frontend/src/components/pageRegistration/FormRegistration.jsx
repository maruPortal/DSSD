import React from "react";
import useStyles from "./formRegistrationStyle";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
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

  const [errorForm, setErrorForm] = React.useState([]);

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
    return (
      <div style={{display:'flex', justifyContent:'center', height: '100vh', alignItems: 'center'}}>
        <p>Loading...</p>
      </div>
    );
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
    setErrorForm(null);

    form.socios = [...partners];
    form.paises = paises.length ? [...paises] : ["Argentina"];
    if (validateForm(form) && aporteTotal === 100) {
      let formData = new FormData();
      formData.append("apoderado", form.apoderado);
      formData.append("domicilioLegal", form.domicilioLegal);
      formData.append("domicilioReal", form.domocilioReal);
      formData.append("emailApoderado", form.emailApoderado);
      formData.append("estatuto", form.estatuto);
      formData.append("nombreSociedad", form.nombreSociedad);

      form.socios.forEach((socio) => formData.append("socios", JSON.stringify(socio)) );
      form.paises.forEach((pais) => formData.append("paises", pais));

      const result = await fetch("http://localhost:3000/expedients/", {
        method: "POST",
        body: formData,
      });
      const jsonResult = await result.json();
      if(result.status === 400) {
        setErrorForm(jsonResult);
      } else {
        setStateSnackbar({
          open: true,
          type: "success",
          message: "Formulario enviado correctamente",
        });
      }
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
      <h2 className={classesForm["text"]}>Registro de Sociedad Anonima</h2>
      <form onSubmit={onSubmitHandler} className={classesForm.form}>
        <Box
          sx={{
            "& .MuiTextField-root": { margin: "2%", width: "90%" },
            "& .customFieldBox": { margin: "2%", width: "90%" },
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
            error={errorForm?.key ==='nombreSociedad'}
            helperText={errorForm?.key ==='nombreSociedad'? errorForm?.validation:null}
          />

          <div className="customFieldBox">
            <Button onClick={handleClickModalOpen}>Agregar Socio</Button>

            <Dialog open={modalOpen} onClose={handleModalClose}>
              <DialogTitle>
                <span className={classesForm["text"]}>Agregar socio</span>
              </DialogTitle>
              <DialogContent>
                <TextField
                  id="nombreSocio"
                  label="Nombre Completo"
                  onChange={(e) =>
                    setPartner(p=> ({ ...p, nombreSocio: e.target.value }))
                  }
                />

                <TextField
                  id="porcentajeAporte"
                  label="Porcentaje de aportes"
                  type="number"
                  onChange={(e) =>
                    setPartner(p=> ({ ...p, porcentajeAporte: e.target.value }))
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleModalClose}>Cancelar</Button>
                <Button onClick={addPartners}>Agregar Socio</Button>
              </DialogActions>
            </Dialog>
          </div>

          { partners.length > 0 && <ul className={classesForm["socios"]}>{listPartners}</ul> }

          <TextField
            select
            label="Apoderado"
            onChange={(e) => setForm({ ...form, apoderado: e.target.value })}
            error={['socios', 'apoderado'].includes(errorForm?.key)}
            helperText={['socios', 'apoderado'].includes(errorForm?.key)? errorForm?.validation:null}
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
            error={errorForm?.key ==='estatuto'}
            helperText={errorForm?.key ==='estatuto'? errorForm?.validation:null}
          />

          <TextField
            id="DomicilioLegal"
            label="Domicilio legal"
            onChange={(e) =>
              setForm({ ...form, domicilioLegal: e.target.value })
            }
            error={errorForm?.key ==='domicilioLegal'}
            helperText={errorForm?.key ==='domicilioLegal'? errorForm?.validation:null}
          />
          <TextField
            id="DomicilioReal"
            label="Domicilio real"
            onChange={(e) =>
              setForm({ ...form, domocilioReal: e.target.value })
            }
            error={errorForm?.key ==='domicilioReal'}
            helperText={errorForm?.key ==='domicilioReal'? errorForm?.validation:null}
          />

          <TextField
            id="emailApoderado"
            label="Correo electrónico"
            type="email"
            onChange={(e) =>
              setForm({ ...form, emailApoderado: e.target.value })
            }
            error={errorForm?.key ==='emailApoderado'}
            helperText={errorForm?.key ==='emailApoderado'? errorForm?.validation:null}
          />
          <div className="customFieldBox">
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Pais (puede seleccionar más de uno)</InputLabel>
              <Select
                id="paises"
                value={paises}
                multiple
                label="Paises"
                disabled={form.exportaServicios}
                renderValue={(selected) => selected.join(",")}
                onChange={(e) => setPaisesHandler(e.target.value)}
                error={errorForm?.key === 'paises'}
              >
                {data.countries.map((pais, index) => (
                  <MenuItem key={pais.code} value={pais.name}>
                    <Checkbox checked={paises.includes(pais.name)} />
                    {pais.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
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
