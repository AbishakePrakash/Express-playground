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
  console.log(`A client connected ${socket.id}`);

  // Handle messages from clients
  socket.on("send_message", (message) => {
    try {
      console.log(`Got a from client ${JSON.stringify(message)}`);
      socket.broadcast.emit("received_message", message, socket.id);
      console.log(`Sent back the messsage to all clients ${message}`);
      // io.emit("received_message", message);
    } catch (error) {
      console.log("Error on : ", error);
    }
  });

  // socket.on("disconnect", () => {
  //   console.log(`A client disconnected ${socket.id}`);
  // });

  // // Send a welcome message to the client
  // socket.emit("message", "Hola, Socket.IO amigo!");
});

app.get("/", (req, res) => {
  const result = {
    success: "",
    data: "",
  };

  res.status(200).send({ ...result, success: "Okay", data: "Hola Amigos" });
  // res.status(503).send({ ...result, success: "Failed", data: "Adios Amigos" });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
