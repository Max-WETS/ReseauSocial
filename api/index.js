const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const friendsRoute = require("./routes/friends");
const conversationsRoute = require("./routes/conversations");
const router = express.Router();
const path = require("path");
const color = require("colors");
const socket = require("socket.io");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected to MongoDB".green);
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(cors());
// app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/friends", friendsRoute);
app.use("/api/conversations", conversationsRoute);

// only intended for heroku build
app.use(express.static(path.join(__dirname, "/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server running".green);
});

// socket.io
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.emit("connection", {
    message: "Welcome, you're connected",
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
