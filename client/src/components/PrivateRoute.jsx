import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);
  console.log("component rendered", `${Component.name}`);
  const isAdminComponent = Component.name === "Admin";
  console.log("is admin component ?", isAdminComponent);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          isAdminComponent ? (
            user.isAdmin ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location },
                }}
              />
            )
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
