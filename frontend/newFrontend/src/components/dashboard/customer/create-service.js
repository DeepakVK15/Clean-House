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
import { TextField } from "@mui/material";

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
  const [startDate, setStartDate] = React.useState(Date());
  const [endDate, setEndDate] = React.useState(Date());
  const [startTime, setStartTime] = React.useState(Date());
  const [endTime, setEndTime] = React.useState(Date());

  const onCreateServiceClick = () => {
    setOpen(true);
    // axios
    //   .get(`${serverURL}/feedback/${service_id}`)
    //   .then((res) => {
    //     console.log("onReviewsClick");
    //     console.log("testtt3", service_id);
    //     setFeedback(res.data.feedback.feedback);
    //   })
    //   .catch((err) => {
    //     console.log("Err ", err);
    //   });
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={onCreateServiceClick}>
        Create Service
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Create Service
        </BootstrapDialogTitle>
        <DialogContent dividers>
          Service Type
          <TextField id="outlined-basic" label="Service Type" variant="outlined" />
          Location
          <TextField id="outlined-basic" label="Location" variant="outlined" />
          Price
          <TextField id="outlined-basic" label="Price" variant="outlined" />
          Description
          <TextField id="outlined-basic" label="Description" variant="outlined" />
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="Start Date Picker"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
              />
            </LocalizationProvider> */}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
