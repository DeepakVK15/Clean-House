package com.sjsu.edu.vms.controller;

import com.sjsu.edu.vms.service.VaccinationService;

import java.util.Optional;

import com.sjsu.edu.vms.model.POJOs.VaccinationData;
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
@RequestMapping("/vaccination")
public class VaccinationController {

  @Autowired
  private VaccinationService vaccinationService;

  @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE })
  public ResponseEntity<?> getVaccinationById(@PathVariable String id) {
    return vaccinationService.getVaccinationById(id);
  }

  @RequestMapping(value = "", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE })
  public ResponseEntity<?> getAllVaccinations(@RequestParam("search") Optional<String> search) {
    return vaccinationService.getAllVaccinations(search);
  }

  @RequestMapping(value = "", method = RequestMethod.POST, produces = { MediaType.APPLICATION_JSON_VALUE })
  public ResponseEntity<?> createVaccination(@RequestBody VaccinationData vaccination) {
    return vaccinationService.createVaccination(vaccination);
  }
}
