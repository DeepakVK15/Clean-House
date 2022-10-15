import React, { Component } from "react";
import { ACCESS_TOKEN, serverURL } from "../../utils/config";
import jwt_decode from "jwt-decode";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
class OAuth2RedirectHandler extends Component {
  getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");

    var results = regex.exec(this.props.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  componentDidMount() {
    const token = this.getUrlParameter("token");
    const email = this.getUrlParameter("email");
    const fName = this.getUrlParameter("firstName");
    const lName = this.getUrlParameter("lastName");
    localStorage.setItem(ACCESS_TOKEN, token);
    localStorage.setItem("email", email);

    if (token) {
      if (localStorage.getItem("accessToken")) {
        setAuthToken(localStorage.getItem("accessToken"));
      }
      axios
        .post(
          `${serverURL}/api/auth/user?email=` +
            email +
            `&fName=` +
            fName +
            `&lName=` +
            lName
        )
        .then((res) => {
          if (res && res.data == "Account Created") {
            alert("Please check your email for verification link.");
            this.props.history.push("/");
          } else if (res) {
            const decoded_token = jwt_decode(res.data.accessToken);
            // localStorage.setItem(ACCESS_TOKEN, decoded_token.sub)
            this.props.history.push("/patient/dashboard");
          }
        })
        .catch((err) => {
          alert("Please check your email for verification link.");
          this.props.history.push("/");
        });
    }
  }
  render() {
    return null;
  }
}

export default OAuth2RedirectHandler;
