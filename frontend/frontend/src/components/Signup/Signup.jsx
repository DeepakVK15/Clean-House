import React from "react";
import {
  TextField,
  Button,
  RadioGroup,
  Radio,
  Grid,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

import { serverURL } from "../../utils/config";
import "../../styles/Signup/Signup.css";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: "",
      mName: "",
      lName: "",
      email: "",
      password: "",
      dob: new Date(),
      address: "",
      city: "",
      state: "",
      zip: "",
      gender: "",
    };
  }

  updateFName = (e) => {
    this.setState({ fName: e.target.value });
  };

  updateMName = (e) => {
    this.setState({ mName: e.target.value });
  };

  updateLName = (e) => {
    this.setState({ lName: e.target.value });
  };

  updateDob = (e) => {
    this.setState({ dob: e.target.value });
  };

  updateEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  updatePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  updateMName = (e) => {
    this.setState({ mName: e.target.value });
  };

  updateAddress = (e) => {
    this.setState({ address: e.target.value });
  };

  updateCity = (e) => {
    this.setState({ city: e.target.value });
  };

  updateState = (e) => {
    this.setState({ state: e.target.value });
  };

  updateGender = (e) => {
    this.setState({ gender: e.target.value });
  };

  updateZip = (e) => {
    this.setState({ zip: e.target.value });
  };

  attemptSignUp = (e) => {
    e.preventDefault();
    const {
      fName,
      mName,
      lName,
      email,
      password,
      gender,
      dob,
      address,
      city,
      state,
      zip,
    } = this.state;

    axios
      .post(
        `${serverURL}/api/auth/register?email=` +
          email +
          `&password=` +
          password +
          `&fName=` +
          fName +
          `&lName=` +
          lName +
          `&gender=` +
          gender +
          `&dob=` +
          dob +
          `&address=` +
          address +
          `&city=` +
          city +
          `&state=` +
          state +
          `&zip=` +
          zip +
          `&mName=` +
          mName
      )
      .then((res) => {
        swal({
          title: "Success",
          text: "Account Created. Please click on the verification link sent to your email for login.",
          icon: "success",
        }).then(() => {
          this.props.history.push("/");
        });
      })
      .catch((err) => {
        swal({
          title: "Failed",
          text: "Email In Use",
          icon: "error",
        });
      });
  };

  cancelSignUp = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <div className="sign-up-grid">
        <form className="sign-up-form" onSubmit={this.attemptSignUp}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField
                label="First Name"
                variant="outlined"
                size="small"
                onChange={this.updateFName}
                style={{ width: "100%" }}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Middle Name"
                variant="outlined"
                size="small"
                onChange={this.updateMName}
                style={{
                  gridArea: "mName",
                }}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Last Name"
                variant="outlined"
                size="small"
                onChange={this.updateLName}
                required
                style={{ width: "75%" }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                size="small"
                onChange={this.updateEmail}
                required
                style={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                size="small"
                inputProps={{
                  minLength: 6,
                  maxLength: 12,
                }}
                onChange={this.updatePassword}
                required
                style={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                id="date"
                label="DOB"
                type="date"
                defaultValue=""
                size={{ width: 220 }}
                onChange={this.updateDob}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
          </Grid>
          `{" "}
          <FormControl component="fieldset">
            <RadioGroup row onChange={this.updateGender}>
              <FormControlLabel value="male" control={<Radio required={true}/>} label="Male" />
              <FormControlLabel 
                value="female"
                control={<Radio required={true}/>}
                label="Female"
              />
              <FormControlLabel
                value="others"
                control={<Radio required={true}/>}
                label="Others"
              />
            </RadioGroup>
          </FormControl>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Street and Number"
                variant="outlined"
                size="small"
                onChange={this.updateAddress}
                style={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="City"
                variant="outlined"
                size="small"
                onChange={this.updateCity}
                defaultValue="San Jose"
                style={{
                  gridArea: "lName",
                }}
                required
                style={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="State"
                variant="outlined"
                size="small"
                onChange={this.updateState}
                defaultValue="California"
                required
                style={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="ZIP"
                variant="outlined"
                size="small"
                onChange={this.updateZip}
                defaultValue="95134"
                required
                style={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="outlined"
            size="small"
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={this.cancelSignUp}
          >
            Cancel
          </Button>
        </form>
      </div>
    );
  }
}

export default withRouter(Signup);
