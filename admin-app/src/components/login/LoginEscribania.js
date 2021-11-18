import { useHistory } from "react-router";
import { routes } from "../../constants/routes";

const { default: LoginForm } = require("./loginForm");

const LoginEscribania = () => {
  const history = useHistory();
  const loginEscribania = (result) => {
    console.log(result);
    localStorage.setItem("userEscribania", JSON.stringify(result));
    history.push(routes.LISTADOESCRIBANIA);
  };
  return <LoginForm onSubmit={loginEscribania} title="Login Escribania" />;
};

export default LoginEscribania;
