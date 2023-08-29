import { ColorModeScript } from "@chakra-ui/react";
import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { WorkspaceContextProvider } from "./Context/WorkspaceProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <Router>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <WorkspaceContextProvider>
        <ChakraProvider theme={theme}>
          <ColorModeScript />
          <App />
        </ChakraProvider>
      </WorkspaceContextProvider>
    </GoogleOAuthProvider>
  </Router>
);

const server = "http://localhost:5000";
// const server = "https://yum-backend.vercel.app";
export default server;
