package com.sjsu.edu.vms.controller;

import java.text.ParseException;

import com.sjsu.edu.vms.service.UserReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/report")
public class UserReportController {

    @Autowired
    private UserReportService userReportService;

    @RequestMapping(value = "/{patientId}", method = RequestMethod.GET, produces = {
            MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> generateReportUserController(@PathVariable String patientId,
            @RequestParam String startDate,
            @RequestParam String endDate, @RequestParam String systemDate) throws ParseException {
        return userReportService.generateUserReport(patientId, startDate, endDate, systemDate);
    }

    @RequestMapping(value = "/admin/{clinicId}", method = RequestMethod.GET, produces = {
            MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> generateReportAdminController(@PathVariable String clinicId,
            @RequestParam String startDate,
            @RequestParam String endDate, @RequestParam String systemDate) throws ParseException {
        return userReportService.generateAdminReport(clinicId, startDate, endDate, systemDate);
    }
}
