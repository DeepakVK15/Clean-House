package com.sjsu.edu.vms.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.sjsu.edu.vms.service.CheckInService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/checkin")
public class CheckinController {

    @Autowired
    private CheckInService checkInService;

    @RequestMapping(value = "/vaccinations/{patientId}", method = RequestMethod.GET, produces = {
            MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> getAllValidCheckIns(@PathVariable String patientId,
            @RequestParam String currentTimeOfApp) throws ParseException {

        if (currentTimeOfApp != null) {
            Date date1 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(currentTimeOfApp);

            return checkInService.getAllAppointmentByPatientId(patientId, date1);
        } else
            return checkInService.getAllAppointmentByPatientId(patientId, new Date());

    }

    @RequestMapping(value = "/{appointmentId}", method = RequestMethod.POST, produces = {
            MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> updateCheckIn(@PathVariable String appointmentId, @RequestParam String currentTimeOfApp)
            throws ParseException {
        if (currentTimeOfApp != null) {
            Date date1 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(currentTimeOfApp);

            return checkInService.updateCheckInByAptId(appointmentId, date1);
        } else

            return checkInService.updateCheckInByAptId(appointmentId, new Date());
    }

    @RequestMapping(value = "/{patientId}", method = RequestMethod.GET, produces = {
            MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> getAllNoShows(@PathVariable String patientId, @RequestParam String currentTimeOfApp)
            throws ParseException {

        if (currentTimeOfApp != null) {
            Date date1 = new SimpleDateFormat("yyyy-MM-dd").parse(currentTimeOfApp);
            return checkInService.getPatientNoShowApts(patientId, date1);
        } else
            return checkInService.getPatientNoShowApts(patientId, new Date());

    }

}
