import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  form: {
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    height: "35rem",
    alignItems: "center",
  },
  "form__submit-button": {
    width: "30%",
    position: "relative",
    background: "black",
    textAlign: "center",
    borderRadius: "50px",
    cursor: "pointer",

    "& h4": {
      color: "white",
    },
    "& button": {
      width: "20%",
    },
  },
  socios: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  text: {
    padding: "5px",

    fontFamily: "Roboto",
    fontStyle: "normal",
    fontSize: "20px",
    lineHeight: "13px",
    letterSpacing: "0.60px",
    color: "rgba(0, 0, 0, 0.54)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form__line: {
    width: "100%",
    opacity: "0.6",
    border: "1px solid #323232;",
    flexGrow: "0",
  },
});

export default useStyles;
