package com.sjsu.edu.vms.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.sjsu.edu.vms.service.PatientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/patient")
public class PatientController {

  @Autowired
  private PatientService patientService;

  @RequestMapping(value = "/{patientId}", method = RequestMethod.GET, produces = {
      MediaType.APPLICATION_JSON_VALUE })
  public ResponseEntity<?> getVaccinationsDue(@PathVariable String patientId, @RequestParam String systemDate)
      throws ParseException {
    Date date1 = new SimpleDateFormat("yyyy-MM-dd").parse(systemDate);

    return patientService.getAllAppointmentByPatientId(patientId, date1);
  }

  @RequestMapping(value = "/{patientId}/vaccination-history", method = RequestMethod.GET, produces = {
      MediaType.APPLICATION_JSON_VALUE })
  public ResponseEntity<?> getAllVaccinationHistory(@PathVariable String patientId, @RequestParam String systemDate)
      throws ParseException {
    Date date1 = new SimpleDateFormat("yyyy-MM-dd").parse(systemDate);

    return patientService.getPastAppointments(patientId, date1);
  }

  @RequestMapping(value = "/{patientId}/scheduled", method = RequestMethod.GET, produces = {
      MediaType.APPLICATION_JSON_VALUE })
  public ResponseEntity<?> getAllScheduledApts(@PathVariable String patientId)
      throws ParseException {
    return patientService.getScheduledAppointments(patientId);
  }

  @RequestMapping(value = "/{patientId}/otherdues", method = RequestMethod.GET, produces = {
      MediaType.APPLICATION_JSON_VALUE
  })
  public ResponseEntity<?> getOtherDues(@PathVariable String patientId, @RequestParam String systemDate)
      throws ParseException {
    Date date1 = new SimpleDateFormat("yyyy-MM-dd").parse(systemDate);

    return patientService.calcApptDue(patientId, date1);
  }

}
