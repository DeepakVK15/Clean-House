package com.sjsu.edu.vms.controller;

import com.sjsu.edu.vms.auth.LoginRequest;
import com.sjsu.edu.vms.model.User;
import com.sjsu.edu.vms.service.AppointmentService;
import com.sjsu.edu.vms.service.CheckInService;
import com.sjsu.edu.vms.service.UserService;
import com.sjsu.edu.vms.model.POJOs.AppointmentData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Optional;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {
        @Autowired
        private AppointmentService appointmentService;

        @RequestMapping(value = "/{patientId}", method = RequestMethod.GET, produces = {
                        MediaType.APPLICATION_JSON_VALUE })
        public ResponseEntity<?> getAppointmentsForPatient(@PathVariable String patientId,
                        @RequestParam("past") Optional<String> past)
                        throws ParseException {
                // Date date1 = new SimpleDateFormat("yyyy-MM-dd").parse(currentTimeOfApp);
                return appointmentService.getAppointmentsForPatient(patientId, past);
        }

        @RequestMapping(value = "/patient/{patientId}", method = RequestMethod.GET, produces = {
                        MediaType.APPLICATION_JSON_VALUE })
        public ResponseEntity<?> getPastOrFutureAppointmentsForPatient(@PathVariable String patientId,
                        @RequestParam("date") String date,
                        @RequestParam("past") Optional<String> past)
                        throws ParseException {
                // Date date1 = new SimpleDateFormat("yyyy-MM-dd").parse(currentTimeOfApp);
                return appointmentService.getPastOrFutureAppointmentsForPatient(patientId, date, past);
        }

        @RequestMapping(value = "", method = RequestMethod.POST, produces = { MediaType.APPLICATION_JSON_VALUE })
        public ResponseEntity<?> createAppointment(@RequestBody AppointmentData appointment) {
                return appointmentService.createAppointment(appointment);
        }

        @RequestMapping(value = "/{patientId}/{appointmentId}", method = RequestMethod.GET, produces = {
                        MediaType.APPLICATION_JSON_VALUE })
        public ResponseEntity<?> getAppointment(@PathVariable String patientId, @PathVariable String appointmentId) {
                return appointmentService.getAppointment(patientId, appointmentId);
        }

        @RequestMapping(value = "/{patientId}/date/{appointmentDate}", method = RequestMethod.GET, produces = {
                        MediaType.APPLICATION_JSON_VALUE })
        public ResponseEntity<?> getPatientAppointmentsOnADate(@PathVariable String patientId,
                        @PathVariable String appointmentDate) {
                return appointmentService.getPatientAppointmentsOnADate(patientId, appointmentDate);
        }

        @RequestMapping(value = "/{appointmentId}", method = RequestMethod.DELETE, produces = {
                        MediaType.APPLICATION_JSON_VALUE })
        public ResponseEntity<?> cancelAppointment(@PathVariable String appointmentId) {
                return appointmentService.cancelAppointment(appointmentId);
        }

        @RequestMapping(value = "/{appointmentId}", method = RequestMethod.PUT, produces = {
                        MediaType.APPLICATION_JSON_VALUE })
        public ResponseEntity<?> updateAppointment(@PathVariable String appointmentId,
                        @RequestBody AppointmentData appointment) {
                return appointmentService.updateAppointment(appointmentId, appointment);
        }
}
