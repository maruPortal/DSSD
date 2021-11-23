import { useHistory } from "react-router";
import { routes } from "../../constants/routes";

const { default: LoginForm } = require("./loginForm");

const LoginEscribania = () => {
  const history = useHistory();
  const loginEscribania = (result) => {
    localStorage.setItem("token", result);
    localStorage.setItem("kind", 'mesaentradas');
    history.push(routes.LISTADOESCRIBANIA);
  };
  return <LoginForm onSubmit={loginEscribania} title="Login" />;
};

export default LoginEscribania;
