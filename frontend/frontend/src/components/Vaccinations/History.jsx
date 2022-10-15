import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { serverURL } from "../../utils/config";
import { useSelector } from "react-redux";

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


const VaccinationHistory = () => {
  const [clinics, setClinics] = useState([])
  const returnClinicNameFromId = (clinicId)=>
  {
  
  const clinic = clinics.filter((clin)=>clin.id===clinicId)

  return clinic.length>0 ? clinic[0].name: ""
  
  }

  const [vaccinations, setVaccinations] = useState([]);
  const systemTime = useSelector((state) => state.currentTime.time);
  useEffect(() => {
    async function fetchDueVaccinations() {
      const response_checkins = await axios.get(
        `${serverURL}/patient/${localStorage.getItem("patientId")}/vaccination-history?systemDate=${systemTime}`
      );
      setVaccinations(response_checkins.data);
    }
    async function fetchClinics() {
      const response_clinics = await axios.get(`${serverURL}/clinic`);
      setClinics(response_clinics.data);
    }
  
    fetchClinics();
    fetchDueVaccinations()
    
  }, [systemTime]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
       
          <TableRow>
            <StyledTableCell>Vaccination Name</StyledTableCell>
            <StyledTableCell>Clinic Name</StyledTableCell>
            <StyledTableCell align="right">Date of Vaccination</StyledTableCell>
            <StyledTableCell align="right">Fights Against</StyledTableCell>
            <StyledTableCell align="right">Appointment Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
         
        {vaccinations.map((vaccine) => (
            <>
              {
                vaccine.vaccinations.map((vaccination)=>
             ( vaccine.appointmentCompleted &&  <StyledTableRow key={vaccine.id}>
             <StyledTableCell component="th" scope="row">
                {vaccination.name}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {returnClinicNameFromId(vaccine.clinicId)}
              </StyledTableCell>
              <StyledTableCell align="right">
          
                  {new Date(vaccine.appointmentDate)
                                        .toString()
                                        .slice(0, 16)}
                </StyledTableCell>
                <StyledTableCell align="right">{Object.keys(vaccination.diseases).map(function(k){return vaccination.diseases[k].name}).join(",")}</StyledTableCell>
                <StyledTableCell align="right">{vaccine.appointmentCompleted? "Completed": "No Show"} {" "}
              <p style={{color: "Green"}}>  { vaccination.duration===0 ? "Lifetime Vaccination": ""}</p></StyledTableCell>
            </StyledTableRow>

             ) )}
         </>
          ))}

        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VaccinationHistory;
