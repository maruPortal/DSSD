import useStyles from "./listadoStyles";

const ShowExpediente = () => {
  const classes = useStyles();
  //ver como pasar al componente todo el objeto expediente
  return (
    <div>
      <h1 className={classes["text-expedient"]}>Nombre de expediente: </h1>
    </div>
  );
};

export default ShowExpediente;
