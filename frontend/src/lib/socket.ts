import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

let socket: Socket | null = null;

/** Connect as a guest — join the table room without auth. */
export const connectAsGuest = (tableNumber: string): Socket => {
  if (socket?.connected) socket.disconnect();

  socket = io(SOCKET_URL, {
    auth: { tableNumber },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return socket;
};

/** Connect as an admin — authenticate with JWT access token. */
export const connectAsAdmin = (accessToken: string): Socket => {
  if (socket?.connected) socket.disconnect();

  socket = io(SOCKET_URL, {
    auth: { token: accessToken },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return socket;
};

/** Get the current socket instance (may be null if not yet connected). */
export const getSocket = (): Socket | null => socket;

/** Disconnect and clean up. */
export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
