import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import moment from "moment";
import swal from "sweetalert";
import Container from "@material-ui/core/Container";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Grid, Button, NativeSelect, InputLabel } from "@material-ui/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import noReservationImage from "./vaccine_2.png";
import MakeReservation from "./MakeReservation";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../../utils/config";

const Reservation = () => {
  const history = useHistory();
  let patientId = localStorage.getItem("patientId");
  const currentTime = useSelector((state) => state.currentTime.time);
  const [alignment, setAlignment] = useState("Upcoming_Appointments");
  const [show, setShow] = useState(false);
  const [bookings, setBookings] = useState([]);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const showModal = () => {
    setShow(!show);
  };

  const sendEmail = async (appointment, type) => {
    try {
      await axios.post(
        `${serverURL}/email/${localStorage.getItem("email")}?type=${type}`,
        appointment
      );
    } catch (error) {}
  };

  const onCancelAppointment = async (appointmentId) => {
    await axios.delete(`${serverURL}/appointment/${appointmentId}`);

    setBookings(
      bookings.map((b) => {
        if (b.appointment.id === appointmentId) {
          b.appointment.cancelled = true;
        }

        return b;
      })
    );

    const appointmentDetails = bookings.find(
      (b) => b.appointment.id === appointmentId
    );

    sendEmail(appointmentDetails.appointment, "cancel");

    swal({
      title: "Success",
      text: "Appointment Cancelled Successfully.",
      icon: "success",
    }).then(() => {});
  };

  useEffect(async () => {
    const currentDate = moment(currentTime).format("YYYY-MM-DD HH:mm");
    let endpoint = `${serverURL}/appointment/patient/${patientId}?date=${currentDate}`;
    if (alignment === "Past_Appointments") {
      endpoint = `${endpoint}&past=true`;
    }
    const response = await axios.get(endpoint);
    setBookings(response.data);
  }, [alignment, currentTime]);

  const isShowingPastAppointments = alignment === "Past_Appointments";

  const renderCardButtons = (appointment) => {
    return (
      <>
        <Button
          style={{
            marginRight: "8px",
            color: "red",
          }}
          color="error"
          onClick={() => onCancelAppointment(appointment.id)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            history.push(`/patient/appointments/${appointment.id}/edit`)
          }
        >
          Update
        </Button>
      </>
    );
  };

  const renderCards = ({ appointment, clinic }) => {
    let status = "";
    let color = "";

    if (appointment.cancelled) {
      status = "Cancelled";
      color = "red";
    } else if (isShowingPastAppointments) {
      if (appointment.hasCheckedIn) {
        status = "Completed";
        color = "Green";
      } else {
        status = "No-Show";
        color = "#ff9966";
      }
    }

    return (
      <Grid item container xs={4} style={{ marginTop: "1%", width: "100%" }}>
        <Card style={{ cursor: "pointer" }} sx={{ minWidth: 360 }}>
          <CardContent>
            {status && <Typography style={{ color }}>{status}</Typography>}
            <Typography variant="h6" component="div">
              {clinic.name}
            </Typography>
            <Typography color="text.secondary">
              Date - {moment(appointment.appointmentDate).format("YYYY-MM-DD")}{" "}
              {appointment.timeSlot}
            </Typography>
            <Typography color="text.secondary">
              Vaccine - {_.get(appointment, "vaccinations[0].name")}
            </Typography>
            <Typography variant="body2">
              Address- {_.get(clinic, "address.street")}
              <br />
              {_.get(clinic, "address.city")}, {_.get(clinic, "address.state")}
              {" - "}
              {_.get(clinic, "address.zipcode")}
            </Typography>
            {!appointment.cancelled &&
              !isShowingPastAppointments &&
              renderCardButtons(appointment)}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Container style={{ textAlign: "left" }}>
      <Grid container>
        <Grid item xs={6}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            sx={{
              "& button": {
                padding: "12px",
              },
            }}
          >
            <ToggleButton value="Upcoming_Appointments">
              Appointments
            </ToggleButton>
            <ToggleButton value="Past_Appointments">
              Past Appointments
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid
          item
          container
          xs={6}
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <Button
            variant="contained"
            style={{ backgroundColor: "dodgerBlue", color: "white" }}
            onClick={() => {
              history.push("/patient/appointments/new");
            }}
          >
            Book Appointment
          </Button>
        </Grid>
      </Grid>

      <Grid
        style={{
          display: "flex",
          flexWrap: "wrap",
          backgroundColor: "#EAEEF3",
          padding: "1%",
          minHeight: "100%",
          marginTop: "16px",
        }}
      >
        {!!bookings.length && bookings.map(renderCards)}
        {!bookings.length && (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: "4%",
            }}
          >
            <div>
              <img src={noReservationImage}></img>
              <h2>No appointments to show</h2>
            </div>
          </div>
        )}
      </Grid>
      {show && <MakeReservation func={showModal} />}
    </Container>
  );
};
export default Reservation;
