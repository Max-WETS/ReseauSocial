import Profile from "./pages/Profile";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./context/AuthContext";
import { SocketContext } from "./socket";

function App() {
  const { user, dispatch } = useContext(AuthContext);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const socket = useContext(SocketContext);

  const handleNewSession = useCallback(({ sessionID, userID, username }) => {
    console.log(
      "sessionID reçu client-side: " +
        sessionID +
        ", session username: " +
        username +
        ", session userID: " +
        userID
    );
    socket.auth = { sessionID };
    localStorage.setItem("sessionID", sessionID);
    socket.userID = userID;
  }, []);

  const handleConnectedUsers = useCallback((users) => {
    const newUsers = users.map((user) => {
      const nUser = user;
      nUser.self = nUser.userID === socket.id;
      nUser.hasNewMessages = false;
      return nUser;
    });
    dispatch({ type: "CONNECTED_USERS", payload: newUsers });
    setConnectedUsers(newUsers);
  }, []);

  const handleNewConnectedUser = useCallback((user) => {
    user.hasNewMessages = false;
    user.self = false;
    setConnectedUsers((prev) => [...prev, user]);
    dispatch({ type: "USER_CONNECTED", payload: user });
  }, []);

  const handleDisconnectedUser = useCallback((user) => {
    const discoUserID = user.userID;
    setConnectedUsers((prev) =>
      [...prev].filter((u) => u.userID !== discoUserID)
    );
    dispatch({ type: "USER_DISCONNECTED", payload: discoUserID });
  }, []);

  useEffect(() => {
    if (!user) return;

    const sessionID = localStorage.getItem("sessionID");
    console.log("client-side sessionID: " + sessionID);

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    } else {
      socket.auth = { username: user["username"], userID: user.userId };
      socket.connect();
    }

    socket.on("session", handleNewSession);

    socket.on("users", handleConnectedUsers);

    socket.on("user connected", handleNewConnectedUser);

    socket.on("user disconnected", handleDisconnectedUser);

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        console.log(err.message);
      }
    });

    return () => {
      socket.off("session", handleNewSession);
      socket.off("users", handleConnectedUsers);
      socket.off("user connected", handleNewConnectedUser);
      socket.off("user disconnected", handleDisconnectedUser);
    };
  }, [
    socket,
    user,
    handleNewSession,
    handleConnectedUsers,
    handleNewConnectedUser,
    handleDisconnectedUser,
  ]);

  useEffect(() => {
    console.log("mise à jour de connectedUsers: ");
    for (let u of connectedUsers) {
      console.log(u);
    }
  }, [connectedUsers]);

  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute
          exact
          path="/profile/:userId"
          component={Profile}
          connectedUsers={connectedUsers}
        />
        <PrivateRoute exact path="/chat" component={Chat} />
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/login">
          {user ? <Redirect to={`/profile/${user.userId}`} /> : <Login />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
