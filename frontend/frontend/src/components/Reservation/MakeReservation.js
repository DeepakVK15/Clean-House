import {
  Modal,
  Typography,
  Box,
  TextField,
  Grid,
  FormLabel,
} from "@material-ui/core/";
import Select from "react-select";
import { useState } from "react";
const MakeReservation = (props) => {
  const [open, setOpen] = useState(true);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid blue",
    boxShadow: 24,
    p: 4,
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const [vaccName, setVaccName] = useState();
  const handleClose = () => {
    setOpen(false);
  };
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const handleChange = (options) => {
    console.log(options);
  };
  return (
    <div>
      <Modal open="true" onClose={props.func}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Reservation
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>
          <Grid style={{ marginTop: "5%" }}>
            {/* <TextField
              style={{ width: "-webkit-fill-available" }}
              id="standard-basic"
              label="Standard"
              variant="standard"
            /> */}
            <Grid item style={{ marginTop: "5%" }}>
              <FormLabel style={{ marginTop: "3%", color: "black" }}>
                Vaccine Name
              </FormLabel>
              <Select
                clearable="true"
                options={options}
                onChange={handleChange}
              />
            </Grid>
            <Grid item style={{ marginTop: "5%" }}>
              <FormLabel style={{ marginTop: "3%", color: "black" }}>
                Clinic
              </FormLabel>
              <Select clearable="true" options={options} />
            </Grid>
            <Grid item style={{ marginTop: "5%" }}>
              <FormLabel style={{ marginTop: "3%", color: "black" }}>
                Vaccine Name
              </FormLabel>
              <Select clearable="true" options={options} />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};
export default MakeReservation;
