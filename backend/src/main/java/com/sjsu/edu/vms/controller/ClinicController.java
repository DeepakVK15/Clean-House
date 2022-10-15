package com.sjsu.edu.vms.controller;

import com.sjsu.edu.vms.service.ClinicService;

import java.util.Optional;

import com.sjsu.edu.vms.model.POJOs.ClinicData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/clinic")
public class ClinicController {

    @Autowired
    private ClinicService clinicService;

    @RequestMapping(value = "/{clinicId}", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> getByClinicId(@PathVariable String clinicId) {
        return clinicService.getClinicById(clinicId);
    }

    @RequestMapping(value = "", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> getAllClinics(@RequestParam("search") Optional<String> search) {
        return clinicService.getAllClinics(search);
    }

    @RequestMapping(value = "", method = RequestMethod.POST, produces = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> createClinic(@RequestBody ClinicData clinic) {
        return clinicService.createClinic(clinic);
    }

    @RequestMapping(value = "/{clinicId}/time-slots/{appointmentDate}", method = RequestMethod.GET, produces = {
            MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> getClinicTimeSlots(@PathVariable String clinicId, @PathVariable String appointmentDate) {
        return clinicService.getClinicTimeSlots(clinicId, appointmentDate);
    }
}
