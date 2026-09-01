import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";
import { initSocket } from "./src/common/socket/socket.js";

const PORT = process.env.PORT || 4000;

const start = async () => {
  // Connect to DB
  await connectDB();

  // Create HTTP server (needed to attach Socket.io)
  const server = http.createServer(app);

  // Initialize Socket.io
  initSocket(server);

  server.listen(PORT, () => {
    console.log(
      `Server is running at PORT: ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
