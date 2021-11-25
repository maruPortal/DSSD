import { useHistory } from "react-router";
import { routes } from "../../constants/routes";
import LoginForm from "./loginForm";

const LoginAdmin = () => {
  const history = useHistory();

  const loginAdmin = (result) => {
    localStorage.setItem("token", result);
    localStorage.setItem("kind", "admin");
    history.push(routes.DASHBOARD);
  };

  return <LoginForm onSubmit={loginAdmin} title="Login" />;
};

export default LoginAdmin;
