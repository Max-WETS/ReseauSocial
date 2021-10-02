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
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import socket from "./socket";

function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    console.log("client-side sessionID: " + sessionID);

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    } else {
      if (user) {
        socket.auth = { username: user["username"] };
        socket.connect();
      }
    }

    socket.on("session", ({ sessionID, userID, username }) => {
      console.log(
        "sessionID reçu client-side: " +
          sessionID +
          ", session username: " +
          username
      );
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        console.log(err.message);
      }
    });
  }, []);

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
