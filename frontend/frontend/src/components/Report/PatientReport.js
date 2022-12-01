import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Doughnut } from "react-chartjs-2";
import { serverURL } from "../../utils/config";
import { Stack } from "@mui/material";
import "chart.js/auto";
import axios from "axios";
import { Paper, styled, Grid, Typography, Button } from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Alert } from "@mui/material";
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  maxHeight: 900,
  overflow: "auto",
  justifyContent: "center",
  width: "100%",
}));

const PatientReport = () => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const systemTime = useSelector((state) => state.currentTime.time);
  const [data, setData] = React.useState("");
  const [error, setError] = React.useState("");
  const [patientReviewChart, setPatientReviewChart] = useState({
    labels: ["Generate to view"],
    datasets: [
      {
        label: "Patient Report",
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],

        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [],
      },
    ],
  });

  const generate = async () => {
    try {
      const response_checkins = await axios.get(
        `${serverURL}/report/${localStorage.getItem(
          "patientId"
        )}?startDate=${moment(startDate).format("YYYY-MM-DD")}&endDate=${moment(
          endDate
        ).format("YYYY-MM-DD")}&systemDate=${moment(systemTime).format(
          "YYYY-MM-DD"
        )}`
      );
      setError("");
      setData(response_checkins.data);
      setPatientReviewChart({
        labels: [
          "Number of Appointments",
          "Number of No Shows",
          "Future Appointments that are not checked in",
          "No Show Rate",
        ],
        datasets: [
          {
            label: "Reviews per day in the month of December",
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: "rgba(0,0,0,1)",
            borderWidth: 2,
            data: [
              response_checkins.data["noOfAppointments"],
              response_checkins.data["noOfNoShow"],
              response_checkins.data["futureUncheckedinApts"],
              response_checkins.data["rate"],
            ],
          },
        ],
      });
    } catch (error) {
      setError(error.response.data.msg);
    }
  };
  //   const systemTime = useSelector((state) => state);
  const patientReviewDoughnut = () => (
    <Doughnut
      data={patientReviewChart}
      options={{
        title: {
          display: true,
          text: "Reviews per day in the month of December",
          fontSize: 20,
        },
        legend: {
          display: true,
          position: "right",
        },
      }}
    />
  );
  return (
    <>
      {error && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="error" style={{ backgroundColor: "orange" }}>
            {error}
          </Alert>
        </Stack>
      )}
      <Grid container>
        <Grid item xs={2}>
          <Item>
            <Typography>Choose a start date to generate report</Typography>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <br />
            <Typography variant="subtitle1">
              {" "}
              <b>
                {" "}
                Start Date : {new Date(startDate).toString().slice(0, 16)}{" "}
              </b>
            </Typography>
          </Item>
          <Item>
            <Typography>Choose an end date to generate report</Typography>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />
            <Typography variant="subtitle1">
              <b> End Date : {new Date(endDate).toString().slice(0, 16)}</b>
            </Typography>
          </Item>
          <Item>
            <Typography>
              <br />
            </Typography>
            <Button
              variant="contained"
              // className="primary"
              onClick={() => {
                generate();
              }}
            >
              Generate Report
            </Button>
          </Item>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Item>{patientReviewDoughnut()}</Item>
          <Item>
            <Typography>Patient Report</Typography>
          </Item>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={4}>
          <Item>
            <Typography>
              {" "}
              <Item>Data</Item>
              {/* <Item>System Date :{systemTime} </Item> */}
              <Item>Number of Appointments : {data["noOfAppointments"]} </Item>
              <Item>Number of No Shows : {data["noOfNoShow"]}</Item>
              <Item>
                Future Appointments that are not checked in :{" "}
                {data["futureUncheckedinApts"]}
              </Item>
              <Item>No Show Rate : {data["rate"]}</Item>
            </Typography>
          </Item>
        </Grid>
      </Grid>
      <Grid item xs={3}></Grid>
    </>
  );
};
export default PatientReport;
