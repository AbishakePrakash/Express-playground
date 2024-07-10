import express, { json } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  Logger(`A client connected ${socket.id}`);

  // Handle messages from clients
  socket.on("send_message", (message) => {
    Logger(`Got a msg from client ${JSON.stringify(message)}`);
    io.emit("received_message", message, socket.id);
    Logger(`Sent back the messsage to all clients ${JSON.stringify(message)}`);
  });
});

app.get("/", (req, res) => {
  res.status(200).send({ success: "Okay", data: "Hola Amigos" });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  Logger(`Server is running on port ${PORT}`);
});
