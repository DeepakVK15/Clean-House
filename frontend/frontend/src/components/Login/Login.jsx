import React from "react";
import { Link, withRouter } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";
import axios from "axios";
import swal from "sweetalert";
import googleLogo from "./google-logo.png";
import setAuthToken from "../../utils/setAuthToken";
import { serverURL, GOOGLE_AUTH_URL } from "../../utils/config";
import "../../styles/Login/Login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  attemptLogin = (e) => {
    console.log("Login ");
    e.preventDefault();
    const { email, password } = this.state;
    const user = { email, password };
    axios
      .post(`${serverURL}/api/auth/login`, user)
      .then((res) => {
        console.log("user login");
        const { accessToken } = res.data;
        localStorage.setItem("email", user.email);
        localStorage.setItem("accessToken", accessToken);

        if (localStorage.getItem("accessToken")) {
          setAuthToken(localStorage.getItem("accessToken"));
        }
        swal({
          title: "Success",
          text: "Log In Successful.",
          icon: "success",
        }).then(() => {
          this.props.history.push("/patient/dashboard");
        });
      })
      .catch((err) => {
        console.log("Err ", err);
        swal({
          title: "Failed",
          text: "Invalid Credentials/Not a verified user.",
          icon: "error",
        });
      });
  };

  updateEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  updatePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  render() {
    return (
      <div className="login-page">
        <form className="login-form" onSubmit={this.attemptLogin}>
          <div className="social-login">
            <a
              className="btn btn-block social-btn google"
              href={GOOGLE_AUTH_URL}
            >
              <img src={googleLogo} alt="Google" /> Log in with Google
            </a>
          </div>
          <div class="hr-sect">OR</div>
          <TextField
            className="login-form-item"
            label="Email"
            variant="outlined"
            type="email"
            onChange={this.updateEmail}
            required
          />
          <TextField
            className="login-form-item"
            label="Password"
            variant="outlined"
            type="password"
            onChange={this.updatePassword}
            required
          />
          <Button className="login-form-item" variant="outlined" type="submit">
            Login
          </Button>
          <Link to="/signup">Need An Account?</Link>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
