import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import { useState } from "react";
import useStyles from "./loginStyles";
import { validateLogIn } from "../../helpers/validateLogIn";
import { loginUser } from "../../services/service";

const LoginForm = ({ onSubmit, title }) => {
  const classes = useStyles();
  const [snackbar, setStateSnackbar] = useState({
    open: false,
    type: "",
    message: "",
  });
  const [form, setForm] = useState({ username: "", password: "" });

  const onCloseSnackbar = () => {
    setStateSnackbar({ ...snackbar, open: false });
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (validateLogIn(form)) {
      //service
      const result = await loginUser(form);

      if (result.status === 401) {
        setStateSnackbar({
          open: true,
          type: "error",
          message: "fallo en la request",
        });
      }
      //onSubmit solo con status 200
      if (result.status === 200) {
        const { token } = await result.json();
        onSubmit(token);
      }
    } else {
      setStateSnackbar({
        open: true,
        type: "error",
        message: "fallo en la validación",
      });
    }
  };

  return (
    <>
      <h2 className={classes["text"]}>{title}</h2>
      <form onSubmit={onSubmitHandler} className={classes.form}>
        <div className={classes.space}>
          <TextField
            required
            id="username"
            label="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div className={classes.space}>
          <TextField
            required
            id="password"
            label="Password"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className={classes.button}>
          <Button key="3" type="submit">
            <h4>LogIn</h4>
          </Button>
        </div>
      </form>
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

export default LoginForm;
