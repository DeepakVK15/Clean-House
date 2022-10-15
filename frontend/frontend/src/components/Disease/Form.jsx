import React, { useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import { serverURL } from "../../utils/config";
import { useHistory } from "react-router-dom";
const DiseaseForm = () => {
  let history = useHistory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const onSubmit = (e) => {
   
    const disease = {
      name: name,
      description: description
    }
     axios.post(
      `${serverURL}/disease`, disease
    );
    history.push("/patient/dashboard")
  };

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
          <h2>Create a Disease Entry</h2>
          <TextField
            required
            label="Disease Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="outlined-disabled"
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button variant="contained" onClick={(e)=>onSubmit(e)}>
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

export default DiseaseForm;
