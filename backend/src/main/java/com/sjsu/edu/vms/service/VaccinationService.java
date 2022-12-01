package com.sjsu.edu.vms.service;

import com.sjsu.edu.vms.exception.BadRequest;
import com.sjsu.edu.vms.model.Vaccination;
import com.sjsu.edu.vms.model.Disease;
import com.sjsu.edu.vms.model.POJOs.VaccinationData;
import com.sjsu.edu.vms.repository.VaccinationRepository;
import com.sjsu.edu.vms.repository.DiseaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VaccinationService {

  @Autowired
  private VaccinationRepository vaccinationRepository;

  @Autowired
  private DiseaseRepository diseaseRepository;

  public ResponseEntity<?> createVaccination(VaccinationData vaccinationData) {
    List<Disease> diseases = diseaseRepository.findMultiple(vaccinationData.getDiseases());
    Vaccination vaccination = new Vaccination(vaccinationData.getName(), diseases, vaccinationData.getManufacturer(),
        vaccinationData.getNumberOfShots(), vaccinationData.getShotInternalVal(), vaccinationData.getDuration());
    vaccinationRepository.save(vaccination);
    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(vaccination);
  }

  public ResponseEntity<?> getVaccinationById(String id) {
    Optional<Vaccination> vaccination = vaccinationRepository.findById(id);
    if (vaccination.isPresent())
      return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(vaccination.get());

    return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
        .body(new BadRequest("400", "Vaccinaton with ID: " + id + " not found."));

  }

  public ResponseEntity<?> getAllVaccinations(Optional<String> search) {
    List<Vaccination> vaccinations;
    if (search.isPresent()) {
      vaccinations = vaccinationRepository.findAllBySearch(search.get());
    } else {
      vaccinations = vaccinationRepository.findAll();
    }
    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(vaccinations);
  }
}
