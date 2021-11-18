import { useHistory } from "react-router";
import { routes } from "../../constants/routes";
import LoginForm from "./loginForm";

const LoginMesaEntrada = () => {
  const history = useHistory();

  const loginMesaEntrada = (result) => {
    localStorage.setItem("userMesaEntrada", JSON.stringify(result));
    history.push(routes.LISTADOMESAENTRADA);
  };
  return (
    <LoginForm onSubmit={loginMesaEntrada} title="Login Mesa de Entrada" />
  );
};

export default LoginMesaEntrada;
