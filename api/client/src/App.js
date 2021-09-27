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
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/profile/:userId" component={Profile} />
        <PrivateRoute exact path="/chat" component={Chat} socket={socket} />
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
