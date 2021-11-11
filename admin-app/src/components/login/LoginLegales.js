const { default: LoginForm } = require("./loginForm");

const LoginLegales = () => {
  const loginLegales = (result) => {
    console.log(result);
    localStorage.setItem("userLegales", JSON.stringify(result));
  };
  return <LoginForm onSubmit={loginLegales} title="Login Legales" />;
};

export default LoginLegales;
