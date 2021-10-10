import { io } from "socket.io-client";
import React from "react";

const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
export const SocketContext = React.createContext();
