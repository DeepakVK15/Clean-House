import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./Checkin.module.css";
import {
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Card,
  Modal,
  Paper,
  styled,
  Grid,
  Box,
  AppBar,
  Tab,
} from "@material-ui/core";
import { Tabs } from "@material-ui/core";
import promoImage from "../../vaccine-promo.jpeg";
import { serverURL } from "../../utils/config";
import { Confirmation } from "./Confirmation";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
  maxHeight: 300,
  overflow: "auto",
  justifyContent: "center",
  width: "80%",
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <Box>{children}</Box>}</div>;
}

const Checkin = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [vaccinations, setVaccinations] = useState("");
  const [noShows, setNoShows] = useState("");
  const systemTime = useSelector((state) => state.currentTime.time);
  useEffect(() => {
    async function fetchCheckInData() {
      const response_checkins = await axios.get(
        `${serverURL}/checkin/vaccinations/${localStorage.getItem(
          "patientId"
        )}?currentTimeOfApp=${systemTime}`
      );
      setVaccinations(response_checkins.data);
    }
    async function fetchNoShowData() {
      const response_noshows = await axios.get(
        `${serverURL}/checkin/${localStorage.getItem(
          "patientId"
        )}?currentTimeOfApp=${systemTime}`
      );
      setNoShows(response_noshows.data);
    }
    fetchCheckInData();
    fetchNoShowData();
  }, [systemTime]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const updateCheckin = async (appointment, aptId) => {
    try {
      await axios.post(
        `${serverURL}/checkin/${aptId}?currentTimeOfApp=${systemTime}`
      );
      setMessage("Congrats! You checked in for your appointment!");
      sendEmail(appointment);
    } catch (error) {
      await setMessage(error.response.data.msg);
      setIsError(true);
      if (error.response.data && error.response.data.code === "407")
        setIsError(false);
    }
    handleOpen(true);
  };
  const sendEmail = async (appointment) => {
    try {
      await axios.post(
        `${serverURL}/email/${localStorage.getItem("email")}?type=checkin`,
        appointment
      );
    } catch (error) {}
  };
  return (
    <>
      <center>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Confirmation message={message} isError={isError} />
          </Modal>
        </div>
      </center>
      <center>
        <hr />
        <div>
          <AppBar position="static" style={{ backgroundColor: "black" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="white"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
              classes={styles.checkinApp}
            >
              <Tab label="Check In" />
              <Tab label="No Shows" />
            </Tabs>
          </AppBar>
        </div>
        <TabPanel value={value} index={0}>
          <Grid container>
            {vaccinations &&
              vaccinations.map((vaccination) => {
                return (
                  <Grid item xs={3}>
                    <Item>
                      {" "}
                      <Card>
                        <CardActionArea
                          onClick={() => {
                            updateCheckin(vaccination, vaccination.id);
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            image={promoImage}
                            alt="green iguana"
                          />

                          {vaccination.vaccinations &&
                            vaccination.vaccinations.map((item) => {
                              return (
                                <>
                                  <hr />
                                  <CardContent>
                                    <Typography
                                      gutterBottom
                                      component="div"
                                      variant="subtitle"
                                    >
                                      {item.name}
                                    </Typography>
                                    <Typography gutterBottom variant="subtitle">
                                      <i
                                        className={`fas fa-calendar-day ${styles.fas}`}
                                      ></i>{" "}
                                      &nbsp;&nbsp;
                                      {new Date(vaccination.appointmentDate)
                                        .toString()
                                        .slice(0, 16)}{" "}
                                      {vaccination.timeSlot}
                                    </Typography>
                                    <Typography
                                      variant="subtitle"
                                      gutterBottom
                                      component="div"
                                    >
                                      <i
                                        className={`fas fa-syringe ${styles.fas}`}
                                      ></i>{" "}
                                      {item.numberOfShots}
                                      <br />
                                      <i
                                        className={`fas fa-stopwatch ${styles.fas}`}
                                      ></i>{" "}
                                      {item.duration === 0
                                        ? 0
                                        : item.shotInternalVal}{" "}
                                      <br />
                                      {item.duration === 0
                                        ? "Note: You are protected for lifetime with this vaccination"
                                        : ""}
                                    </Typography>
                                    <Typography
                                      variant="subtitle"
                                      gutterBottom
                                      component="div"
                                    >
                                      {vaccination.hasCheckedIn ? (
                                        <i
                                          className={`fas fa-unlock-alt ${styles.fas}`}
                                        ></i>
                                      ) : (
                                        <i
                                          className={`fas fa-lock ${styles.fas}`}
                                        ></i>
                                      )}
                                      &nbsp;&nbsp;&nbsp;
                                      {vaccination.hasCheckedIn ? (
                                        <Fragment style={{ fontSize: "10px" }}>
                                          Checkedin
                                        </Fragment>
                                      ) : (
                                        <Fragment style={{ fontSize: "10px" }}>
                                          Not checkedin
                                        </Fragment>
                                      )}
                                    </Typography>
                                    <Typography
                                      variant="subtitle"
                                      color="text.secondary"
                                    >
                                      <Typography
                                        variant="subtitle"
                                        color="text.secondary"
                                      >
                                        {item.diseases &&
                                          item.diseases.map((disease) => {
                                            return (
                                              <>
                                                <p>
                                                  Vaccination For :{" "}
                                                  {disease.name}
                                                </p>
                                                {/* <p>{disease.description}</p> */}
                                              </>
                                            );
                                          })}
                                      </Typography>
                                    </Typography>
                                  </CardContent>
                                </>
                              );
                            })}
                        </CardActionArea>
                      </Card>
                    </Item>
                  </Grid>
                );
              })}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container>
            {noShows &&
              noShows.map((vaccination) => {
                return (
                  <Grid item xs={3}>
                    <Item>
                      {" "}
                      <Card>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="140"
                            image={promoImage}
                            alt="green iguana"
                          />
                          <CardContent>
                            {/* <i className={`fas fa-id-card ${styles.fas}`}></i>{" "}
                            &nbsp;&nbsp;
                            {vaccination.id} */}
                            <br />
                            <i
                              className={`fas fa-calendar-day ${styles.fas}`}
                            ></i>{" "}
                            &nbsp;&nbsp;
                            {new Date(vaccination.appointmentDate)
                              .toString()
                              .slice(0, 16)}{" "}
                            {vaccination.timeSlot}
                          </CardContent>

                          {vaccination.vaccinations &&
                            vaccination.vaccinations.map((item) => {
                              return (
                                <>
                                  <hr />
                                  <CardContent>
                                    <Typography
                                      gutterBottom
                                      component="div"
                                      variant="subtitle"
                                    >
                                      {item.name}
                                    </Typography>
                                    <Typography
                                      gutterBottom
                                      component="div"
                                      variant="subtitle"
                                    >
                                      <i
                                        className={`fas fa-syringe ${styles.fas}`}
                                      ></i>{" "}
                                      {item.numberOfShots}
                                      <br />
                                      {item.duration === 0
                                        ? 0
                                        : item.shotInternalVal}
                                      <br />
                                      {item.duration === 0
                                        ? "Note: You are protected for lifetime with this vaccination"
                                        : ""}
                                    </Typography>

                                    <Typography
                                      variant="subtitle"
                                      color="text.secondary"
                                    >
                                      <Typography
                                        variant="subtitle"
                                        color="text.secondary"
                                      >
                                        {item.diseases &&
                                          item.diseases.map((disease) => {
                                            return (
                                              <>
                                                <p>
                                                  Vaccination For:{" "}
                                                  {disease.name}
                                                </p>
                                                {/* <p>{disease.description}</p> */}
                                              </>
                                            );
                                          })}
                                      </Typography>
                                    </Typography>
                                  </CardContent>
                                </>
                              );
                            })}
                        </CardActionArea>
                      </Card>
                    </Item>
                  </Grid>
                );
              })}
          </Grid>
        </TabPanel>
      </center>
    </>
  );
};
export default Checkin;
