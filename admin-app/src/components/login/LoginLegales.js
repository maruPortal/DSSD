import { useHistory } from "react-router";
import { routes } from "../../constants/routes";
import LoginForm from "./loginForm";

const LoginLegales = () => {
  const history = useHistory();

  const loginLegales = (result) => {
    localStorage.setItem("token", result);
    // TODO
    localStorage.setItem("username", null);
    localStorage.setItem("kind", 'legales');
    history.push(routes.LISTADOLEGALES);
  };
  return <LoginForm onSubmit={loginLegales} title="Login" />;
};

export default LoginLegales;
