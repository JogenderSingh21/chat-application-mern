const cors = require("cors");
const express = require("express");
const { chats } = require("./data/data");
const { connectDB } = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(5000, console.log("listening on port 5000"));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors:{
    origin: "http://localhost:5173"
  }
})

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on('setup', (userData) => {
    console.log(userData._id);
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("user joined " + room);
    // socket.emit("connected")
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on('new message', (newMessageRecieved) => {
    // console.log(newMessageRecieved)
    var chat = newMessageRecieved.chat[0];
    // console.log(chat)

    if(!chat.users) return console.log("chat.users not defined");

    chat.users.forEach(user => {
      if(user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
})