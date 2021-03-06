import React, { useState, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { from, split, HttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

import { grey } from "@material-ui/core/colors";
import { CssBaseline } from "@material-ui/core";

import Router from "./Router";

const FullApp = (props) => {
  const providerRef = useRef();

  const httpLink = new HttpLink({
    uri:  "/graphql",
    credentials: "same-origin",
  });

 

  const wsLink = new WebSocketLink({
    uri:
      !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? "ws://localhost:8000/graphql"
        : "wss://attica-voting.com/graphql",
    options: {
      timeout: 30000,
      reconnect: true
    },
  });

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      if (graphQLErrors.map((error) => error.extensions.code).includes("INTERNAL_SERVER_ERROR")) {
        providerRef.current.enqueueSnackbar("GraphQL Error - See Console");
        graphQLErrors.forEach((error) => {
          if (!error.message) console.error(`An Unknown Error Has Occurred`);
          console.error(`Error: ${error.message}. Operation: ${error.path}`);
        });
      } else {
        console.error(graphQLErrors);
      }
    }
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    wsLink,
    httpLink
  );

  const additiveLink = from([errorLink, splitLink]);

  const client = new ApolloClient({
    link: additiveLink,
    cache: new InMemoryCache(),
  });

  return (
    <SnackbarProvider maxSnack={3} preventDuplicate ref={providerRef}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ApolloProvider>
    </SnackbarProvider>
  );
};

const App = () => {
  const theme = createTheme({
    palette: {
      primary: { main: "#1E4D2B" },
      secondary: { main: "#C8C372" },
      neutral: { main: "#FFFFFF", light: grey[100], dark: grey[200] },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FullApp />
    </ThemeProvider>
  );
};

export default App;
