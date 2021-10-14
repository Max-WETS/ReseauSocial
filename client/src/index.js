import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContext } from "./socket";
import socket from "../src/socket";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <SocketContext.Provider value={socket}>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </SocketContext.Provider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
