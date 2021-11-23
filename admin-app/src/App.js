import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { routes } from "./constants/routes";
import LoginMesaEntrada from "./components/login/LoginMesaEntrada";
import LoginLegales from "./components/login/LoginLegales";
import ListadoMesaEntrada from "./components/listado/ListadoMesaEntrada";
import ListadoLegales from "./components/listado/ListadoLegales";
import LoginEscribania from "./components/login/LoginEscribania";
import ListadoEscribania from "./components/listado/ListadoEscribania";
import ShowExpediente from "./components/listado/ShowExpediente";

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route path={routes.INIT} exact>
          <LoginMesaEntrada />
        </Route>
        <Route path={routes.LOGINENTRADA}>
          <LoginMesaEntrada />
        </Route>
        <Route path={routes.LOGINLEGALES}>
          <LoginLegales />
        </Route>
        <Route path={routes.LOGINESCRIBANIA}>
          <LoginEscribania />
        </Route>
        <Route path={routes.LISTADOMESAENTRADA}>
          <ListadoMesaEntrada />
        </Route>
        <Route path={routes.LISTADOLEGALES}>
          <ListadoLegales />
        </Route>
        <Route path={routes.LISTADOESCRIBANIA}>
          <ListadoEscribania />
        </Route>
        <Route path={routes.SHOWEXPEDIENTE}>
          <ShowExpediente />
        </Route>
        <Route exact path={routes.ERROR}>
          <Redirect to={routes.INIT} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
