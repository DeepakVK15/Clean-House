import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import swal from "sweetalert";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Grid,
} from "@material-ui/core/";
import axios from "axios";
import { serverURL } from "../../utils/config";
import TimeSlotPicker from "../TimePicker";
const BookReservation = () => {
  const history = useHistory();
  const { appointmentId } = useParams();
  const patientId = localStorage.getItem("patientId");
  const currentTime = useSelector((state) => state.currentTime.time);
  const [date, setDate] = useState(moment(currentTime).format("YYYY-MM-DD"));
  const [searchClinic, setSearchClinic] = useState("");
  const [searchVaccine, setSearchVaccine] = useState("");
  const [allClinic, setAllClinic] = useState([]);
  const [allVaccine, setAllVaccine] = useState([]);
  const [clinic, setClinic] = useState({});
  const [vaccine, setVaccine] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);

  useEffect(() => {
    if (date != currentTime) {
      setDate(moment(currentTime).format("YYYY-MM-DD"));
    }
  }, [currentTime]);

  useEffect(async () => {
    if (appointmentId) {
      const patientId = localStorage.getItem("patientId");
      const response = await axios.get(
        `${serverURL}/appointment/${patientId}/${appointmentId}`
      );

      if (response.data) {
        setClinic(response.data.clinic);
        setVaccine(response.data.appointment.vaccinations[0]);
        setDate(
          moment(response.data.appointment.appointmentDate).format("YYYY-MM-DD")
        );
        setSelectedSlot(response.data.appointment.timeSlot);
      }
    }
  }, [appointmentId]);

  useEffect(async () => {
    let endPoint = `${serverURL}/clinic`;

    if (searchClinic) {
      endPoint = `${endPoint}?search=${searchClinic}`;
    }

    const response = await axios.get(endPoint);
    setAllClinic(response.data);
    if (!appointmentId) {
      if (response.data.length > 0) {
        setClinic(response.data[0]);
      }
    }
  }, [searchClinic]);

  useEffect(async () => {
    let endPoint = `${serverURL}/vaccination`;

    if (searchVaccine) {
      endPoint = `${endPoint}?search=${searchVaccine}`;
    }

    const response = await axios.get(endPoint);
    setAllVaccine(response.data);

    if (!appointmentId) {
      if (response.data.length > 0) {
        setVaccine(response.data[0]);
      }
    }
  }, [searchVaccine]);

  useEffect(async () => {
    if (clinic.id && date) {
      const response = await axios.get(
        `${serverURL}/clinic/${clinic.id}/time-slots/${date}`
      );

      setTimeSlots(response.data);

      const apptResponse = await axios.get(
        `${serverURL}/appointment/${patientId}/date/${date}`
      );

      setPatientAppointments(apptResponse.data);
    }
  }, [clinic.id, date]);

  useEffect(() => {
    if (timeSlots.length && patientAppointments.length) {
      const patientAppointmentTimeSlotMap = _.keyBy(
        patientAppointments,
        "timeSlot"
      );
      setTimeSlots(
        timeSlots.map((slot) => ({
          ...slot,
          isAlreadyBooked: !!patientAppointmentTimeSlotMap[slot.slot],
        }))
      );
    }
  }, [patientAppointments]);

  const sendEmail = async (appointment, type) => {
    try {
      await axios.post(
        `${serverURL}/email/${localStorage.getItem("email")}?type=${type}`,
        appointment
      );
    } catch (error) {}
  };

  const onChangeAppointmentDate = (e) => {
    setDate(e.target.value);
  };

  const onSelectSlot = (slot) => {
    setSelectedSlot(slot.slot);
  };

  const onConfirmAppointment = async () => {
    const appointment = {
      patientId: localStorage.getItem("patientId"),
      clinicId: clinic.id,
      appointmentDate: `${date} ${selectedSlot}`,
      timeSlot: selectedSlot,
      vaccinations: [vaccine.id],
    };

    let response;
    if (appointmentId) {
      response = await axios.put(
        `${serverURL}/appointment/${appointmentId}`,
        appointment
      );
    } else {
      response = await axios.post(`${serverURL}/appointment`, appointment);
    }

    const slotParts = selectedSlot.split(":");
    const hour = parseInt(slotParts[0]);
    const mins = parseInt(slotParts[1]);
    const appointmentDate = moment(date);
    appointmentDate.hours(hour);
    appointmentDate.minutes(mins);
    appointment.id = appointmentId || response.data.id;
    appointment.appointmentDate = appointmentDate;
    appointment.vaccinations = [vaccine];
    sendEmail(appointment, appointmentId ? "update" : "make");

    swal({
      title: "Success",
      text: `Appointment ${appointmentId ? "Updated" : "Booked"} Successfully.`,
      icon: "success",
    }).then(() => {
      history.push("/patient/appointments");
    });
  };

  const renderClinicCard = (item) => {
    let styles2 = {
      cursor: "pointer",
      margin: "2% 2% 1% 2%",
      borderBottom: "5px solid blue",
    };
    let styles3 = {
      cursor: "pointer",
      margin: "2%",
    };

    return (
      <div key={item.id}>
        <Card
          style={item.id == clinic.id ? styles2 : styles3}
          sx={{ minWidth: "-webkit-fill-available" }}
          onClick={() => {
            setClinic(item);
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              {item.name}
            </Typography>
            <Typography variant="body2">
              {item.address.street}
              <br />
              {item.address.city}, {item.address.state} {item.address.zipcode}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVaccineCard = (item) => {
    let styles2 = {
      cursor: "pointer",
      margin: "2% 2% 1% 2%",
      borderBottom: "5px solid blue",
    };
    let styles3 = {
      cursor: "pointer",
      margin: "2%",
    };
    return (
      <div key={item.id}>
        <Card
          style={item.id == vaccine.id ? styles2 : styles3}
          sx={{ minWidth: "-webkit-fill-available" }}
          onClick={() => {
            setVaccine(item);
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              {item.name}
            </Typography>
            <Typography variant="body2">
              Diseases - {item.diseases.map((d) => d.name).join(", ")}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSearchBoxes = () => (
    <Grid container xs={12}>
      <Grid item container xs={4}>
        <TextField
          styleid="outlined-basic"
          label="Clinic Name"
          variant="outlined"
          style={{ width: "-webkit-fill-available", marginBottom: "7%" }}
          onChange={(e) => {
            setSearchClinic(e.target.value);
          }}
        />
      </Grid>
      <Grid item container xs={4}>
        <TextField
          id="outlined-basic"
          label="Vaccine"
          variant="outlined"
          style={{
            width: "-webkit-fill-available",
            marginBottom: "5%",
            marginLeft: "2%",
          }}
          onChange={(e) => {
            setSearchVaccine(e.target.value);
          }}
        />
      </Grid>
    </Grid>
  );

  const renderAppointmentDetails = () => (
    <Grid container style={{ marginBottom: "16px" }}>
      <Grid item container style={{ marginLeft: "4%" }}>
        <Grid container>
          <div style={{ marginTop: "2%" }}>
            <Typography variant="h5" component="div">
              {clinic && clinic.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {selectedSlot && `Appointment time - ${selectedSlot}`}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Vaccine - {vaccine && vaccine.name}
            </Typography>

            <Typography variant="body2">
              Address - {_.get(clinic, "address.street")}
              <br />
              {_.get(clinic, "address.city")},&nbsp;
              {_.get(clinic, "address.state")}&nbsp; - &nbsp;
              {_.get(clinic, "address.zipcode")}
            </Typography>
          </div>
          {date && clinic.id && vaccine.id && selectedSlot && (
            <div>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "dodgerBlue",
                  color: "white",
                  marginTop: "6%",
                }}
                onClick={onConfirmAppointment}
              >
                Confirm
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </Grid>
  );

  const isCurrentDateAndAppointmentDateSame = moment(currentTime).isSame(
    date,
    "day"
  );

  return (
    <Grid container style={{ margin: "3%" }}>
      <Grid item style={{ marginBottom: "2%" }} container xs={4}>
        <div
          style={{ lineHeight: "2rem", marginRight: "2%", fontWeight: "700" }}
        >
          Appointment Date:
        </div>
        <TextField
          type="date"
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: moment(currentTime).add(1, "y").format("YYYY-MM-DD"),
            min: moment(currentTime).format("YYYY-MM-DD"),
          }}
          value={moment(date).format("YYYY-MM-DD")}
          onChange={onChangeAppointmentDate}
        />
      </Grid>
      <Grid item container xs={4}>
        {renderAppointmentDetails()}
      </Grid>
      {renderSearchBoxes()}
      <Grid item container xs={4}>
        <div
          style={{
            fontWeight: 700,
            backgroundColor: "#EAEEF3",
            width: "-webkit-fill-available",
            marginRight: "1%",
            height: "65vh",
            overflowY: "auto",
          }}
        >
          <div>Clinics</div>
          {allClinic.map(renderClinicCard)}
        </div>
      </Grid>
      <Grid item container xs={4}>
        <div
          style={{
            fontWeight: 700,
            backgroundColor: "#EAEEF3",
            width: "-webkit-fill-available",
            marginRight: "1%",
            overflowY: "auto",
          }}
        >
          <div>Vaccine</div>
          {allVaccine && allVaccine.map(renderVaccineCard)}
        </div>
      </Grid>
      <Grid item container xs={4}>
        <Box sx={{ width: "300px" }}>
          <TimeSlotPicker
            onSelectSlot={onSelectSlot}
            activeSlot={selectedSlot}
            slots={timeSlots}
            currentTime={
              isCurrentDateAndAppointmentDateSame &&
              `${moment().hours()}:${moment().minutes()}`
            }
          />
        </Box>
      </Grid>
    </Grid>
  );
};
export default BookReservation;
