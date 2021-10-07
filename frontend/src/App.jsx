import React from "react";
import "./App.css";
import { Route, Switch, useHistory } from "react-router-dom";
import FormRegistration from "./components/pageRegistration/FormRegistration";
import Button from "@mui/material/Button";
import { routes } from "./constants/routes";
import { setup } from "./graphql/graphql";
import { ApolloProvider } from "@apollo/client";

const client = setup();

function App() {
  const history = useHistory();

  const goRegistration = () => {
    history.push(routes.REGISTRATION);
  };
  return (
    <ApolloProvider client={client}>
      <Switch>
        <Route path={routes.INIT} exact>
          <Button onClick={goRegistration}>Crear sociedad anonima</Button>
        </Route>
        <Route path={routes.REGISTRATION}>
          <FormRegistration />
        </Route>
      </Switch>
    </ApolloProvider>
  );
}

export default App;
