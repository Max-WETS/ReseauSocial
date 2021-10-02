const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
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
// app.use("/images", express.static(path.join(__dirname, "public/images")));

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
// app.use(express.static(path.join(__dirname, "/client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/client/build", "index.html"));
// });

httpServer.listen(process.env.PORT || 5000, () => {
  console.log("Backend server running".green);
});

// socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  console.log("sessionID déjà sauvegardée: " + sessionID);

  const MapIter = sessionStore.findAllSessions();
  for (const [key, value] of MapIter) {
    console.log(
      `${key} = username: ${value.username}, userID: ${value.userID}`
    );
  }

  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    console.log("session stockée: " + session);
    if (session) {
      console.log("session username: " + session.username);
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      next();
    }
  }

  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }

  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });
  console.log(
    "sessionID à sauvegarder: " +
      socket.sessionID +
      ", session's username: " +
      socket.username
  );

  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
  });

  socket.join(socket.userID);

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  socket.on("disconnect", () => {
    socket.on("disconnect", async () => {
      const matchingSockets = await io.in(socket.userID).allSockets();
      // console.log("matching sockets: " + matchingSockets);
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        // notify other users
        socket.broadcast.emit("user disconnected", socket.userID);
        // update the connection status of the session
        sessionStore.saveSession(socket.sessionID, {
          userID: socket.userID,
          username: socket.username,
          connected: false,
        });
        const session = sessionStore.findSession(sessionID);
        console.log(
          "session déconnectée: " +
            session.sessionID +
            ", statut de connexion: " +
            session.connected
        );
      }
    });
  });
});
