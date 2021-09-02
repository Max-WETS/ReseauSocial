import Profile from "./pages/Profile";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/chat">
          <Chat />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
