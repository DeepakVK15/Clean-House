import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { serverURL } from "../../utils/config";
import { Select, Chip,MenuItem,OutlinedInput, InputLabel  } from "@material-ui/core";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const VaccinationCreateForm = () => {
  let history = useHistory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [numOfShots, setNumOfShots] = useState("");
  const [shotInterval, setShotInterval] = useState("");
  const [duration, setDuration] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [availableDiseases, setAvailableDiseases] = useState([])
  const handleChange = (event) => {
    let {
      target: { value}
    } = event;
    setDiseases( typeof value === 'string' ? value.split(',') : value);
  };
  const returnNameFromId = (diseaseId)=>
  {
 
  const disease = availableDiseases.filter((dis)=>dis.id===diseaseId)

  return disease.length>0 ? disease[0].name: ""
  
  }
  useEffect(() => {
    async function fetchDisesase() {
      const diseases_data = await axios.get(
        `${serverURL}/disease`
      );
      setAvailableDiseases(diseases_data.data);
    }

    fetchDisesase()

  }, [])
   const onSubmit = (e) => {
    e.preventDefault()
    if(diseases.length===0)
    {
      alert("Please choose one or more diseases!")
    }
    else
    {
      const vaccine = {
      name: name,
      description: description,
      diseases: diseases,
      manufacturer: manufacturer,
      numberOfShots: duration===""?1:numOfShots,
      shotInternalVal:  duration===""?0: shotInterval,
      duration: duration
    }
     axios.post(
      `${serverURL}/vaccination`, vaccine
    );
    history.push("/patient/dashboard")}
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
          <h2>Create a Vaccination Entry</h2>
          <TextField
            required
            label="Vaccination Name"
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
             <InputLabel id="diseases">Diseases</InputLabel>
      <Select
          labelId="diseases"
          id="diseases"
          name= "diseases"
          required
          multiple
          value={diseases}
          onChange={handleChange}
          style={{width: "400px"}}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {
            selected.map((key,value) => (
                <Chip key={key} label={availableDiseases.length>0 && returnNameFromId(key)} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {availableDiseases.map((disease) => (
            <MenuItem
              key={disease.id}
              value={disease.id}
            >
              {disease.name}
            </MenuItem>
          ))}
        </Select>
          <TextField
            required
            label="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
          <TextField
            required
            label="Number of Shots"
            value={numOfShots}
            onChange={(e) => setNumOfShots(e.target.value)}
          />
          <TextField
            required
            label="Shot Interval"
            value={shotInterval}
            onChange={(e) => setShotInterval(e.target.value)}
          />
          <TextField
            required
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
         <span style={{opacity:"0.5" , color:"black" , fontSize:"12px"}}>If duration is empty then the vaccine gives protection for lifetime</span> 
       <br/>   <Button variant="contained" onClick={(e)=>onSubmit(e)}>
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

export default VaccinationCreateForm;
