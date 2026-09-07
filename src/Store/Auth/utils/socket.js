// src/Store/Auth/utils/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:7000";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // connect manually once we know the user's role
});