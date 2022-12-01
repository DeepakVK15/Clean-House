import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
// import { Router } from "react-router"
import store from "./store";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import OAuth2RedirectHandler from "./components/Login/OAuth2RedirectHandler";
import axios from "axios";
import { serverURL } from "./utils/config";
import { PatientRoutes } from "./Routes/PatientRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import setAuthToken from "./utils/setAuthToken";
if (localStorage.getItem("accessToken")) {
  setAuthToken(localStorage.getItem("accessToken"));
}

function App() {
  useEffect(() => {
    let email = localStorage.getItem("email");

    async function fetchUserInfo() {
      if (email) {
        const userInfo = await axios.post(
          `${serverURL}/api/auth/user/info?email=${email}`
        );

        if (userInfo && userInfo.data) {
          localStorage.setItem("user", JSON.stringify(userInfo.data));
          localStorage.setItem("patientId", userInfo.data.id);
        }
      }
    }
    fetchUserInfo();
  }, []);
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/signup" exact>
              <Signup />
            </Route>
            <Route path="/" exact>
              <Login />
            </Route>
            <Route path="/patient/">
              <PatientRoutes />
            </Route>
            <Route path="/admin">
              <AdminRoutes />
            </Route>
            <Route
              path="/oauth2/redirect"
              component={OAuth2RedirectHandler}
            ></Route>
          </Switch>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
