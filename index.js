const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
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
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to MongoDB".green);
  }
);
mongoose.connection.on("error", (err) => {
  console.error(err);
});

// app.use("/images", express.static(path.join(__dirname, "public/images")));
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

//middleware
app.use(express.json());
app.use(cookieParser());
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});
// app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/friends", friendsRoute);
app.use("/api/conversations", conversationsRoute);

// only intended for heroku build
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

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
  // console.log("sessionID déjà sauvegardée: " + sessionID);

  const MapSessions = sessionStore.findAllSessions();
  // console.log("nbre de sessions enregistrées: " + MapSessions.size);
  // for (const [key, value] of MapSessions.entries()) {
  //   console.log(
  //     `${key} = username: ${value.username}, userID: ${value.userID}`
  //   );
  // }

  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    // console.log("session stockée: " + session);
    if (session) {
      // console.log("session username: " + session.username);
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
  const userID = socket.handshake.auth.userID;
  // console.log("socket.auth.userID: " + userID);
  if (!username) {
    return next(new Error("invalid userID"));
  }

  socket.sessionID = randomId();
  socket.userID = userID;
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

  let users = [];

  const updateUsers = () => {
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: socket.userID,
        username: socket.username,
      });
    }
  };
  updateUsers();

  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    // users: users,
  });

  socket.on("private message", ({ message, to }) => {
    socket.to(to).emit("private message", {
      senderID: socket.userID,
      message,
    });
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    // console.log("nbre matching sockets: " + matchingSockets.size);
    // for (const entry of matchingSockets.entries()) {
    //   console.log(entry);
    // }
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      users = users.filter((u) => u.userID !== socket.userID);
      socket.broadcast.emit("user disconnected", {
        userID: socket.userID,
        username: socket.username,
        // users: users,
      });
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
      const session = sessionStore.findSession(socket.sessionID);
      console.log(
        "session déconnectée: " +
          socket.sessionID +
          ", session's username: " +
          session.username +
          ", session's userID: " +
          session.userID +
          ", statut de connexion: " +
          session.connected
      );
    }
  });
});
