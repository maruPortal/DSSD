import LoginForm from "./loginForm";

const LoginMesaEntrada = () => {
  const loginMesaEntrada = (result) => {
    console.log("mesa de entrada", result);
    localStorage.setItem("userMesaEntrada", JSON.stringify(result));
  };
  return (
    <LoginForm onSubmit={loginMesaEntrada} title="Login Mesa de Entrada" />
  );
};

export default LoginMesaEntrada;
