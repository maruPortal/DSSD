import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { routes } from "./constants/routes";
import Listado from "./components/listado/listadoExpedientes";
import LoginMesaEntrada from "./components/login/LoginMesaEntrada";
import LoginLegales from "./components/login/LoginLegales";
import Button from "@mui/material/Button";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <div>
            <Button key="3" href={routes.LOGINENTRADA}>
              <h4>LogIn Mesa de entrada</h4>
            </Button>
            <Button key="4" href={routes.LOGINLEGALES}>
              <h4>LogIn Legales</h4>
            </Button>
            <Button key="5" href={routes.LOGINESCRIBAN}>
              <h4>LogIn Escribanos</h4>
            </Button>
          </div>
        </Route>
        <Route path={routes.LOGINENTRADA} exact>
          <LoginMesaEntrada />
        </Route>
        <Route path={routes.LOGINLEGALES} exact>
          <LoginLegales />
        </Route>
        <Route path={routes.LISTADO}>
          <Listado />
        </Route>
        <Route exact path={routes.ERROR}>
          <Redirect to="/" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
