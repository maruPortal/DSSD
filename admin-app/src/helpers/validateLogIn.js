export const validateLogIn = (form) => {
  if (form.username === "") return false;

  if (form.password === "") return false;

  return true;
};
