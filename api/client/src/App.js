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
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import socket from "./socket";

function App() {
  const { user, dispatch } = useContext(AuthContext);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    // console.log("client-side sessionID: " + sessionID);

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    } else if (user) {
      socket.auth = { username: user["username"], userID: user.userId };
      socket.connect();
    }

    socket.on("session", ({ sessionID, userID, username }) => {
      // console.log(
      //   "sessionID reçu client-side: " +
      //     sessionID +
      //     ", session username: " +
      //     username +
      //     ", session userID: " +
      //     userID
      // );
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        console.log(err.message);
      }
    });

    socket.on("users", (users) => {
      const newUsers = users.map((user) => {
        const nUser = user;
        nUser.self = nUser.userID === socket.id;
        nUser.hasNewMessages = false;
        return nUser;
      });
      setConnectedUsers(newUsers);
      dispatch({ type: "CONNECTED_USERS", payload: newUsers });

      // console.log("Chargement / utilisateurs connectés: " + newUsers.length);
      // for (let u of newUsers) {
      //   console.log(u);
      // }
    });

    socket.on("user connected", (user) => {
      const users = user.users;
      setConnectedUsers(users);
      dispatch({ type: "CONNECTED_USERS", payload: users });
    });

    socket.on("user disconnected", (user) => {
      const users = user.users;
      setConnectedUsers(users);
      dispatch({ type: "CONNECTED_USERS", payload: users });
    });
  }, [dispatch, user]);

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
        <PrivateRoute exact path="/profile/:userId" component={Profile} />
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
