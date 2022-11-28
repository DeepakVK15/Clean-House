import { Avatar, Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoneyIcon from "@mui/icons-material/Money";
import { serverURL } from "../../../../../newFrontend/src/utils/config";
import axios from "axios";
import swal from "sweetalert";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const UpcomingAppts = (props) => {
  const email = localStorage.getItem("email");
  const id = localStorage.getItem("userId");
  const userType = localStorage.getItem("user_type");
  const [futureServices, setFutureServices] = useState([]);

  useEffect(() => {
    axios
      .get(`${serverURL}/services/requests/${id}`)
      .then((res) => {
        console.log("user login");
        console.log("testtt", res.data);
        setFutureServices(res.data.future_services);
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
              Upcoming Appointments
            </Typography>
          </Grid>
          <Grid item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Service Type</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Time</TableCell>
                    <TableCell align="center">Location</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Customer ID</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {futureServices.map((row) => {
                    console.log("scdscsd", futureServices);
                    return (
                      <TableRow
                        key={row.id}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell align="center" component="th" scope="row">
                          {row.service_type}
                        </TableCell>
                        <TableCell align="center">{row.date}</TableCell>
                        <TableCell align="center">{row.time}</TableCell>
                        <TableCell align="center">{row.location}</TableCell>
                        <TableCell align="center">{row.price}</TableCell>
                        <TableCell align="center">{row.description}</TableCell>
                        <TableCell align="center">{row.customer_id}</TableCell>
                        <TableCell align="center">
                          {row.status == "PENDING" ? (
                            <>
                              <Box
                                sx={{
                                  display: "grid",
                                  gap: 2,
                                  gridTemplateColumns: "repeat(2, 1fr)",
                                }}
                              >
                                <Button type="submit" variant="outlined" size="small">
                                  Reject
                                </Button>

                                <Button type="submit" variant="outlined" size="small">
                                  Confirm
                                </Button>
                              </Box>
                            </>
                          ) : (
                            "TEST"
                          )}
                        </TableCell>
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
