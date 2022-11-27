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

      fullName: "",
      password: "",
      userType: "",
      address: "",
      phone: "",
    };
  }

  updateFullName = (e) => {
    this.setState({ fullName: e.target.value });
  };

  updateUserType = (e) => {
    this.setState({ userType: e.target.value });
  };

  updatePhone = (e) => {
    this.setState({ phone: e.target.value });
  };

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
      phone,
      userType,
    } = this.state;

    // axios
    // .post(
    //   `${serverURL}/users?email=` +
    //     email +
    //     `&password=` +
    //     password +
    //     // `&fName=` +
    //     // fName +
    //     // `&lName=` +
    //     // lName +
    //     `&user_type=` +
    //     userType +
    //     `&address=` +
    //     address +
    //     `&phone=` +
    //     phone
    // )

    axios({
      method: "post",
      url: `${serverURL}/users`,
      headers: {},
      data: {
        email: email,
        password: password,
        user_type: userType,
        address: address,
        phone: phone,
      },
    })
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
            {/* <Grid item xs={4}>
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
            </Grid> */}
            <Grid item xs={4}>
              <TextField
                label="Last Name"
                variant="outlined"
                size="small"
                onChange={this.updateLName}
                style={{ width: "100%" }}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Phone"
                variant="outlined"
                size="small"
                onChange={this.updatePhone}
                style={{
                  gridArea: "phone",
                  width: "100%",
                }}
                // style={{ width: "100%" }}
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField
                label="Address"
                type="address"
                variant="outlined"
                size="small"
                onChange={this.updateAddress}
                required
                style={{ width: "300%" }}
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

            {/* <Grid item xs={4}>
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
            </Grid> */}
          </Grid>
          `{" "}
          <FormControl component="fieldset">
            <RadioGroup row onChange={this.updateUserType}>
              <FormControlLabel
                value="VENDOR"
                control={<Radio required={true} />}
                label="Vendor"
              />
              <FormControlLabel
                value="CUSTOMER"
                control={<Radio required={true} />}
                label="Customer"
              />
            </RadioGroup>
          </FormControl>
          {/* <Grid container spacing={1}>
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
          </Grid> */}
          <Button type="submit" variant="outlined" size="small">
            Sign Up
          </Button>
          <Button variant="outlined" size="small" onClick={this.cancelSignUp}>
            Cancel
          </Button>
        </form>
      </div>
    );
  }
}

export default withRouter(Signup);
