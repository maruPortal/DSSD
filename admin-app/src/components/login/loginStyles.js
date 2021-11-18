import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  form: {
    position: "relative",
    width: "100%",
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
  },
  space: {
    margin: "2%",
  },
  button: {
    width: "15%",
    position: "relative",
    background: "black",
    textAlign: "center",
    borderRadius: "50px",
    cursor: "pointer",
    "& h4": {
      color: "white",
      fontFamily: "Roboto",
    },
  },
  text: {
    padding: "5px",
    marginTop: "15%",
    fontFamily: "Roboto",
    fontSize: "30px",
    lineHeight: "13px",
    letterSpacing: "0.60px",
    color: "rgba(0, 0, 0, 0.54)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default useStyles;
