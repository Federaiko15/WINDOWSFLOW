import express from "express";
import cors from "cors";
import profileRouter from "./routes/profiles.route.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import handleEvents from "./socket/events.js";
import { UsbWatcher } from "./watchers/usbWatcher.js";
import { ThemeWatcher } from "./watchers/themeWatcher.js";

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const usbWatcher = new UsbWatcher(io);
app.set("usbWatcher", usbWatcher);
const themeWatcher = new ThemeWatcher();
app.set("themeWatcher", themeWatcher);

const PORT = process.env.PORT || 3000;

app.use("/api/v1/flow", profileRouter);

io.on("connection", (socket) => {
  console.log("a user connected");
  themeWatcher.startListening();
  handleEvents(socket, usbWatcher, themeWatcher);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
