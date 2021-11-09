import { BrowserRouter, Route, Switch } from "react-router-dom";

import Button from "@mui/material/Button";
import { routes } from "./constants/routes";
import Listado from "./components/listado/listadoExpedientes";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={routes.INIT} exact>
          <Button>login</Button>
        </Route>
        <Route path={routes.LISTADO}>
          <Listado />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
