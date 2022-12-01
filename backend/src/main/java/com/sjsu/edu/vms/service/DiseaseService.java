package com.sjsu.edu.vms.service;

import com.sjsu.edu.vms.exception.BadRequest;
import com.sjsu.edu.vms.model.Disease;
import com.sjsu.edu.vms.model.POJOs.DiseaseData;
import com.sjsu.edu.vms.repository.DiseaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiseaseService {

  @Autowired
  private DiseaseRepository diseaseRepository;

  public ResponseEntity<?> createDisease(DiseaseData diseaseData) {
    Disease disease = new Disease(diseaseData.getName(), diseaseData.getDescription());
    diseaseRepository.save(disease);
    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(disease);
  }

  public ResponseEntity<?> getDiseaseById(String id) {
    Optional<Disease> disease = diseaseRepository.findById(id);
    if (disease.isPresent())
      return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(disease.get());

    return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
        .body(new BadRequest("400", "Disease with ID: " + id + " not found."));

  }

  public ResponseEntity<?> getAllDiseases(Optional<String> search) {
    List<Disease> diseases;
    if (search.isPresent()) {
      diseases = diseaseRepository.findAllBySearch(search.get());
    } else {
      diseases = diseaseRepository.findAll();
    }
    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(diseases);
  }
}
