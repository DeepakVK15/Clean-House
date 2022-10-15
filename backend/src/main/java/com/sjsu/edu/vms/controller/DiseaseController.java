package com.sjsu.edu.vms.controller;

import com.sjsu.edu.vms.service.DiseaseService;

import java.util.Optional;

import com.sjsu.edu.vms.model.POJOs.DiseaseData;
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
@RequestMapping("/disease")
public class DiseaseController {

  @Autowired
  private DiseaseService diseaseService;

  @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE })
  public ResponseEntity<?> getDiseaseById(@PathVariable String id) {
    return diseaseService.getDiseaseById(id);
  }

  @RequestMapping(value = "", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE })
  public ResponseEntity<?> getAllDiseases(@RequestParam("search") Optional<String> search) {
    return diseaseService.getAllDiseases(search);
  }

  @RequestMapping(value = "", method = RequestMethod.POST, produces = { MediaType.APPLICATION_JSON_VALUE })
  public ResponseEntity<?> createDisease(@RequestBody DiseaseData disease) {
    return diseaseService.createDisease(disease);
  }
}
