import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { serverURL } from "../../utils/config";
import { useHistory } from "react-router-dom";

import { convertSingleToDoubleDigit } from "../../utils/helper";

const ClinicForm = () => {
  let history = useHistory();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [state, setState] = useState("");
  const [startHours, setStartHours] = useState("8");
  const [endHours, setEndHours] = useState("16");
  const [numOfPhysicians, setNumOfPhysicians] = useState("");

  const handleOnStartTimeChange= (e)=>
  {
    let startTime = e.target.value;
    let endTime = (startTime + 8) % 24;
    endTime =  endTime < 0 ? 24 + endTime : +endTime;
    setStartHours(startTime)
    setEndHours(endTime)
  }
  const onSubmit = (e) => {
    const clinic = {
      name: name,
      address:address,
      city:city,
      zipCode: zipCode,
      state: state,
      businessStartHours: startHours,
      businessEndHours:endHours,
      numberOfPhysicians:numOfPhysicians
    }
     axios.post(
      `${serverURL}/clinic`, clinic
    );
    history.push("/patient/dashboard")
  };

  const createBusinessHourOptions = (hour) =>
    [...Array(24)].map((_, i) => (
      <MenuItem disabled={hour <= i && i < hour + 8} value={i}>
        {convertSingleToDoubleDigit(i)}
      </MenuItem>
    ));

  return (
    <Grid container spacing={3}>
      <Grid xs={3}>
        <div></div>
      </Grid>
      <Grid item xs={6}>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "400px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
          noValidate
          autoComplete="off"
        >
          <h2>Create a Clinic Entry</h2>
          <TextField
            required
            label="Clinic Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="outlined-disabled"
            label="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            id="outlined-disabled"
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField
            id="outlined-disabled"
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <TextField
            id="outlined-disabled"
            label="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <FormControl required sx={{ m: 1, minWidth: 400 }}>
            <InputLabel>Business Start Hour</InputLabel>
            <Select
              value={startHours}
              label="Business Start Hour"
              onChange={(e) => handleOnStartTimeChange(e)}
            >
              {createBusinessHourOptions()}
            </Select>
          </FormControl>
          <FormControl required sx={{ m: 1, minWidth: 400 }}>
            <InputLabel>Business End Hour</InputLabel>
            <Select
              value={endHours}
              label="Business End Hour"
              onChange={(e) => setEndHours(e.target.value)}
            >
              {createBusinessHourOptions(startHours)}
            </Select>
            <FormHelperText>
              Business hours should be atleast 8 hours
            </FormHelperText>
          </FormControl>
          <TextField
            required
            label="Number of Physicians"
            value={numOfPhysicians}
            onChange={(e) => setNumOfPhysicians(e.target.value)}
          />
          <Button variant="contained" onClick={onSubmit}>
            Sumbit
          </Button>
        </Box>
      </Grid>
      <Grid xs={3}>
        <div></div>
      </Grid>
    </Grid>
  );
};

export default ClinicForm;
