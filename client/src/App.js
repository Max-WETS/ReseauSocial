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
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./context/AuthContext";
import { SocketContext } from "./socket";

function App() {
  const { user, dispatch } = useContext(AuthContext);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const socket = useContext(SocketContext);

  const handleNewSession = useCallback(
    ({ sessionID, userID, username }) => {
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
    },
    [socket]
  );

  const handleConnectedUsers = useCallback(
    (users) => {
      dispatch({ type: "CONNECTED_USERS", payload: users });
      setConnectedUsers(users);
    },
    [dispatch]
  );

  const handleNewConnectedUser = useCallback(
    (user) => {
      console.log(
        "new user / sessionID: ",
        user.sessionID,
        ", userID: " + user.userID
      );
      console.log(
        "connected users: ",
        connectedUsers,
        "nouvel utilisateur: ",
        !connectedUsers.find(
          (u) => u.sessionID === user.sessionID && u.userID && user.sessionID
        ),
        "utilisateur existant: ",
        connectedUsers.find(
          (u) => u.sessionID === user.sessionID && u.userID && user.sessionID
        ),
        "utilisateur connecté: ",
        user
      );
      if (
        !connectedUsers.find(
          (u) => u.userID === user.userID && u.sessionID === user.sessionID
        )
      ) {
        setConnectedUsers((prev) => [...prev, user]);
        dispatch({ type: "USER_CONNECTED", payload: user });
      }
    },
    [connectedUsers, dispatch]
  );

  const handleDisconnectedUser = useCallback(
    (user) => {
      console.log("ok");
      console.log("disconnection / user.sessionID: ", user.sessionID);
      dispatch({ type: "USER_DISCONNECTED", payload: user.sessionID });
      setConnectedUsers((prev) =>
        [...prev].filter((u) => u.sessionID !== user.sessionID)
      );
    },
    [dispatch]
  );

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
        <PrivateRoute exact path="/admin" component={Admin} />
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/login">
          {user ? <Redirect to={`/profile/${user.userId}`} /> : <Login />}
        </Route>
        <Route exact path="/forgotPassword">
          {user ? (
            <Redirect to={`/profile/${user.userId}`} />
          ) : (
            <ForgotPassword />
          )}
        </Route>
        <Route exact path="/reset/:token">
          {user ? (
            <Redirect to={`/profile/${user.userId}`} />
          ) : (
            <ResetPassword />
          )}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
