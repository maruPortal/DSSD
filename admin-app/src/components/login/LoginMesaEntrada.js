import { useHistory } from "react-router";
import { routes } from "../../constants/routes";
import LoginForm from "./loginForm";

const LoginMesaEntrada = () => {
  const history = useHistory();

  const loginMesaEntrada = (result) => {
    localStorage.setItem("token", result);
    localStorage.setItem("kind", "mesaentradas");
    history.push(routes.LISTADOMESAENTRADA);
  };
  return <LoginForm onSubmit={loginMesaEntrada} title="Login" />;
};

export default LoginMesaEntrada;
