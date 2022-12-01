import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "../../../utils/config";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Book from "./Book";

export const CustomerServices = (props) => {
  const [userId, setUserId] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [bookingModal, setBookingModal] = useState(false);
  const [serviceId, setServiceId] = useState(null);

  const onBookingClick = (e, serviceId) => {
    e.preventDefault();
    setBookingModal(true);
    setServiceId(serviceId);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setBookingModal(false);
    getDetails();
  };

  const getDetails = () => {
    axios
      .get(`${serverURL}/services`)
      .then((res) => {
        setAllServices(res.data.services);
      })
      .catch((err) => {
        console.log("Err ", err);
      });
  };

  useEffect(() => {
    getDetails();
  }, [userId]);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      let userIdTemp = JSON.parse(localStorage.getItem("user")).id;
      setUserId(userIdTemp);
    }
  }, []);

  return (
    <>
      <Card style={{ width: "70rem" }} sx={{ height: "100%" }} {...props}>
        <CardContent>
          <Grid container direction="column" spacing={3} sx={{ justifyContent: "space-between" }}>
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="overline">
                All Services
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
                      <TableCell align="Center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allServices.length > 0 &&
                      allServices.map((row) => {
                        return (
                          <TableRow
                            key={row.id}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell align="Center" component="th" scope="row">
                              {row.service_type}
                            </TableCell>
                            <TableCell align="Center">
                              {row.date.split(" ").slice(0, 4).join(" ")}
                            </TableCell>
                            <TableCell align="Center">{row.time}</TableCell>
                            <TableCell align="Center">{row.location}</TableCell>
                            <TableCell align="Center">${row.price}</TableCell>
                            <TableCell align="Center">{row.description}</TableCell>
                            <TableCell align="Center">
                              <Button
                                type="submit"
                                variant="outlined"
                                size="small"
                                onClick={(e) => onBookingClick(e, row.id)}
                                style={{ backgroundColor: "blue", color: "white" }}
                              >
                                Book
                              </Button>
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
      <Book
        open={bookingModal}
        handleClose={handleClose}
        serviceId={serviceId}
        userId={userId}
        setIsServices={props.setIsServices}
      />
    </>
  );
};
