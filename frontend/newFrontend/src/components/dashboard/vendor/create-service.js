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
  const id = React.useState(localStorage.getItem("userId"));
  const [serviceType, setServiceType] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [startTime, setStartTime] = React.useState();
  const [endTime, setEndTime] = React.useState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    const data = {
      user_id: id,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      services: [
        {
          service_type: serviceType,
          location: location,
          price: price,
          description: description,
        },
      ],
    };
    console.log("eeeeeeeeee", stringify(data));

    axios
      .post(`${serverURL}/services`, stringify(data))
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
              onChange={(newValue) => setServiceType(newValue)}
            />
            Location
            <TextField
              id="outlined-basic"
              label="Location"
              variant="outlined"
              onChange={(newValue) => setLocation(newValue)}
            />
            Price
            <TextField
              id="outlined-basic"
              label="Price"
              variant="outlined"
              onChange={(newValue) => setPrice(newValue)}
            />
            Description
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              onChange={(newValue) => setDescription(newValue)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Datetime"
                value={dayjs()}
                onChange={handleStarttimeChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <DateTimePicker
                label="End Datetime"
                value={dayjs()}
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
