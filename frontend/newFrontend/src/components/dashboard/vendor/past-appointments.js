import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "../../../../../newFrontend/src/utils/config";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const PastAppts = (props) => {
  const email = localStorage.getItem("email");
  const id = localStorage.getItem("userId");
  const userType = localStorage.getItem("user_type");
  const [pastServices, setPastServices] = useState([]);

  useEffect(() => {
    axios
      .get(`${serverURL}/services/requests/${id}`)
      .then((res) => {
        console.log("user login");
        console.log("testtt", res.data);
        setPastServices(res.data.past_services);
      })
      .catch((err) => {
        console.log("Err ", err);
      });
  }, []);

  return (
    // <Card style={{ width: "70rem" }} sx={{ height: "100%" }} {...props}>
    <Card sx={{ height: "100%" }} {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Past Appointments
            </Typography>
          </Grid>
          <Grid item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Service Type</TableCell>
                    <TableCell align="Center">Date</TableCell>
                    <TableCell align="Center">Time</TableCell>
                    <TableCell align="Center">Location</TableCell>
                    <TableCell align="Center">Price</TableCell>
                    <TableCell align="Center">Description</TableCell>
                    <TableCell align="Center">Customer ID</TableCell>
                    <TableCell align="Center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pastServices.map((row) => {
                    console.log("scdscsd", pastServices);
                    return (
                      <TableRow
                        key={row.id}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell align="Center" component="th" scope="row">
                          {row.service_type}
                        </TableCell>
                        <TableCell align="Center">{row.date}</TableCell>
                        <TableCell align="Center">{row.time}</TableCell>
                        <TableCell align="Center">{row.location}</TableCell>
                        <TableCell align="Center">{row.price}</TableCell>
                        <TableCell align="Center">{row.description}</TableCell>
                        <TableCell align="Center">{row.customer_id}</TableCell>
                        <TableCell align="Center">{row.status}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
