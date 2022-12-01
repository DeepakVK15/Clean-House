import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { serverURL } from "../../../utils/config";
// import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { parse, stringify, toJSON, fromJSON } from "flatted";
import { Box } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CreateService() {
  const [open, setOpen] = React.useState(false);
  console.log("ccccccccc");
  const id = React.useState(JSON.parse(localStorage.getItem("userId")));
  const [serviceType, setServiceType] = React.useState("");
  const [locationn, setLocation] = React.useState("");
  const [pricee, setPrice] = React.useState("");
  const [descriptionn, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState("2022/11/30");
  const [endDate, setEndDate] = React.useState("2022/11/30");
  const [startTime, setStartTime] = React.useState("12:30");
  const [endTime, setEndTime] = React.useState("12:30");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    console.log("id", id);
    console.log("sss", startDate);
    console.log("ttt", startTime);

    let data = {};
    data.user_id = 6;
    data.start_date = startDate;
    data.end_date = endDate;
    data.start_time = startTime;
    data.end_time = endTime;
    let serviceArray = [];
    let serviceObj = {};
    serviceObj.service_type = serviceType;
    serviceObj.location = locationn;
    serviceObj.price = pricee;
    serviceObj.description = descriptionn;
    serviceArray.push(serviceObj);
    data.services = serviceArray;

    console.log("description", descriptionn);
    console.log("serviceee", serviceArray);
    // const data = {
    //   user_id: id,
    //   end_date: endDate,
    //   start_time: startTime,
    //   end_time: endTime,
    //   services: [
    //     {
    //       service_type: serviceType,
    //       location: location,
    //       price: price,
    //       description: description,
    //     },
    //   ],
    // };
    console.log("eeeeeeeeee", data);

    axios
      .post(`${serverURL}/services`, data)
      .then(() => {
        console.log("onCreateServices");
      })
      .catch((err) => {
        console.log("Err ", err);
      });
  };

  const handleStarttimeChange = (newValue) => {
    setStartDate(newValue.format("YYYY/MM/DD"));
    setStartTime(newValue.format("HH:mm"));
    console.log("startDate", startDate);
    console.log("startTime", startTime);
  };

  const handleEndtimeChange = (newValue) => {
    setEndDate(newValue.format("YYYY/MM/DD"));
    setEndTime(newValue.format("HH:mm"));
    console.log("endDate", endDate);
    console.log("endTime", endTime);
  };

  console.log("zzz", startDate);
  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Create A New Service
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Create Service
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            <Typography>Upcoming Appointments</Typography>
            <TextField
              id="outlined-basic"
              label="Service Type"
              variant="outlined"
              onChange={(e) => setServiceType(e.target.value)}
            />
            Location
            <TextField
              id="outlined-basic"
              label="Location"
              variant="outlined"
              onChange={(e) => setLocation(e.target.value)}
            />
            Price
            <TextField
              id="outlined-basic"
              label="Price"
              variant="outlined"
              onChange={(e) => setPrice(e.target.value)}
            />
            Description
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              onChange={(e) => setDescription(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Datetime"
                value={startDate}
                onChange={handleStarttimeChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <DateTimePicker
                label="End Datetime"
                value={endDate}
                onChange={handleEndtimeChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Create Service
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
