import express from "express";
import cors from "cors";
import profileRouter from "./routes/profiles.route.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import handleEvents from "../socket/events.js";

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const PORT = process.env.PORT || 3000;

app.use("/api/v1/flow", profileRouter);

io.on("connection", (socket) => {
  console.log("a user connected");
  handleEvents(socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
