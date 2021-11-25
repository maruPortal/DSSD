import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { routes } from "./constants/routes";
import LoginAdmin from "./components/login/LoginAdmin";
import LoginMesaEntrada from "./components/login/LoginMesaEntrada";
import LoginLegales from "./components/login/LoginLegales";
import LoginEscribania from "./components/login/LoginEscribania";

import ListadoMesaEntrada from "./components/listado/ListadoMesaEntrada";
import ListadoLegales from "./components/listado/ListadoLegales";
import ListadoEscribania from "./components/listado/ListadoEscribania";

import ShowExpediente from "./components/listado/ShowExpediente";

import Dashboard from "./components/dashboard/Dashboard";

import { setup } from "./graphql/graphql";
import { ApolloProvider } from "@apollo/client";
import CargarFormulario from "./components/formRegistro/cargarFormulario";
import EditarFormulario from "./components/formRegistro/editarFormulario";

const client = setup();

function App() {
  return (
    <ApolloProvider client={client}>
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
          <Route path={routes.LOGINADMIN}>
            <LoginAdmin />
          </Route>
          <Route path={routes.DASHBOARD}>
            <Dashboard />
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
          <Route path={routes.CREARSOCIEDAD}>
            <CargarFormulario />
          </Route>
          <Route path={routes.EDITARSOCIEDAD}>
            <EditarFormulario />
          </Route>
          <Route exact path={routes.ERROR}>
            <Redirect to={routes.INIT} />
          </Route>
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
