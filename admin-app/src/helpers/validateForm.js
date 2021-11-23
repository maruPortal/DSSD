export const validateForm = (form) => {
  if (form.sociedad === "") return false;

  if (form.apoderado === "") return false;

  if (form.estatuto === "") return false; // PDF

  if (form.domicilioLegal === "") return false;

  if (form.domicilioReal === "") return false;

  if (form.email === "") return false;

  return true;
};
