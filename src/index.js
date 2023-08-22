import { ColorModeScript } from "@chakra-ui/react";
import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { WorkspaceContextProvider } from "./Context/WorkspaceProvider";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <Router>
    <WorkspaceContextProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript />
        <App />
      </ChakraProvider>
    </WorkspaceContextProvider>
  </Router>
);

// const server = "http://localhost:5000";
const server = "https://yum-backend.vercel.app";
export default server;
