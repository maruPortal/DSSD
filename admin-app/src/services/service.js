export const loginUser = async (user) => {
  const result = await fetch("http://localhost:3000/loginAs", {
    method: "POST",
    body: user,
  });
  return result;
};
