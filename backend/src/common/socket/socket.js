import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.utils.js";

let io;

/**
 * Initialize Socket.io on the given HTTP server.
 * Call this once in server.js after creating the http server.
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://10.126.72.80:5173",
        "http://10.126.72.80:5174",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const { token, tableNumber } = socket.handshake.auth;

    // ── Admin socket connection ──────────────────────────────────────────
    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        if (decoded.role === "admin") {
          socket.join("admin");
          console.log(`[socket] Admin connected: ${socket.id}`);
        }
      } catch {
        console.warn(`[socket] Invalid admin token — disconnecting ${socket.id}`);
        socket.disconnect(true);
        return;
      }
    }

    // ── Guest socket connection ──────────────────────────────────────────
    if (tableNumber) {
      const room = `table-${tableNumber}`;
      socket.join(room);
      console.log(`[socket] Guest joined room ${room}: ${socket.id}`);
    }

    socket.on("disconnect", () => {
      console.log(`[socket] Disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get the initialized io instance.
 * Use this in services/controllers to emit events.
 */
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized — call initSocket first");
  return io;
};

export { initSocket, getIO };
