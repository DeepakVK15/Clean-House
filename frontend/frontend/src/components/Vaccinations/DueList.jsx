import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { serverURL } from "../../utils/config";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const VaccinationDues = () => {
  const systemTime = useSelector((state) => state.currentTime.time);
  const [vaccinations, setVaccinations] = useState([]);
  const [vaccinationNames, setVaccinationNames] = useState([]);
  const [otherDues,setOtherDues] = useState([]);
  const [scheduledDues,setScheduledDues] = useState([]);
  useEffect(() => {
    async function fetchDueVaccinations() {
      const response_checkins = await axios.get(
        `${serverURL}/patient/${localStorage.getItem("patientId")}?systemDate=${systemTime}`
      );
      setVaccinations(response_checkins.data);
    }
    async function fetchVaccinationData() {
      const response_vaccinationNames = await axios.get(
        `${serverURL}/vaccination`
      );
      setVaccinationNames(response_vaccinationNames.data);
    }
    async function fetchOtherDues() {
      const response_vaccinationNames = await axios.get(
        `${serverURL}/patient/${localStorage.getItem("patientId")}/otherdues?systemDate=${systemTime}`
      );
      setOtherDues(response_vaccinationNames.data);
    }
    async function fetchScheduledDues() {
      const response_scheduledDues = await axios.get(
        `${serverURL}/patient/${localStorage.getItem("patientId")}/scheduled`
      );
      setScheduledDues(response_scheduledDues.data);
    }
    fetchScheduledDues()
    fetchVaccinationData()
    fetchOtherDues()
    fetchDueVaccinations()
  }, [systemTime]);

  const returnNameFromId = (vaccinationId)=>
  {
 
  const vaccination = vaccinationNames.filter((vac)=>vac.id===vaccinationId)

  return vaccination.length>0 ? vaccination[0].name: ""
  
  }
  return (
    <>
      <h3>Follow up dues</h3>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Vaccination Name</StyledTableCell>
            <StyledTableCell>Latest Shot</StyledTableCell>
            <StyledTableCell align="right">Number of Shots Pending</StyledTableCell>
            {/* <StyledTableCell align="right">Clinic</StyledTableCell> */}
            <StyledTableCell align="right">Next Shot Date</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vaccinations.map((vaccine) => (
            (new Date(moment(vaccine.date).add(vaccine.duration, 'months')) > new Date(systemTime) && vaccine.countPending>0 &&
              (<StyledTableRow key={vaccine.id}>

                <StyledTableCell component="th" scope="row">
                  {returnNameFromId(vaccine.id)}
                </StyledTableCell>
                <StyledTableCell align="right">

                  {new Date(vaccine.latestDate)
                    .toString()
                    .slice(0, 16)}
                </StyledTableCell>

                <StyledTableCell align="right">{vaccine.countPending>0?vaccine.countPending:0 }</StyledTableCell>

                <StyledTableCell align="right"> {vaccine.countPending>0?new Date(moment(vaccine.date).add(vaccine.duration, 'months').format())
                  .toString()
                  .slice(0, 16): "N/A"}</StyledTableCell>
              </StyledTableRow>))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <br/>
    <h3>Other dues</h3>
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Vaccination Name</StyledTableCell>
              <StyledTableCell>Fights Against</StyledTableCell>
              <StyledTableCell>Appointment Status</StyledTableCell>
            </TableRow>
           
          </TableHead>
          <TableBody>
            {otherDues.map((vaccine) => (
                (<StyledTableRow key={vaccine.id}>

                  <StyledTableCell component="th" scope="row">
                  {vaccine.name}
                  </StyledTableCell>
                  <StyledTableCell >
                  {Object.keys(vaccine.diseases).map(function(k){return vaccine.diseases[k].name}).join(",")}
                  </StyledTableCell>
                  <StyledTableCell > Not Booked</StyledTableCell>
                </StyledTableRow>)
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br/>
    <h3>Scheduled appointments</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Appointment Date</StyledTableCell>
              <StyledTableCell>Vaccination Names</StyledTableCell>
              <StyledTableCell>Appointment Status</StyledTableCell>
            </TableRow>
           
          </TableHead>
          <TableBody>
            {scheduledDues.map((vaccine) => (
                (<StyledTableRow key={vaccine.id}>

        <StyledTableCell> 
  {new Date(vaccine.appointmentDate)
                    .toString()
                    .slice(0, 16)}
                    </StyledTableCell>
                  
                  <StyledTableCell >
                  {Object.keys(vaccine.vaccinations).map(function(k){return vaccine.vaccinations[k].name}).join(",")}
                  </StyledTableCell>
                  <StyledTableCell > {new Date(vaccine.appointmentDate) < new Date(systemTime) ? (!vaccine.appointmentCompleted?"No Show" : "Completed") : "Future"}</StyledTableCell>
                </StyledTableRow>)
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </>
  );
};

export default VaccinationDues;
