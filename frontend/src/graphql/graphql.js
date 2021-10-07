import { ApolloClient, InMemoryCache } from "@apollo/client";

export const setup = () => {
  const client = new ApolloClient({
    uri: "https://countries.trevorblades.com/",
    cache: new InMemoryCache(),
  });

  return client;
};
