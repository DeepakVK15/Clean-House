package com.sjsu.edu.vms.service;

import com.sjsu.edu.vms.model.Appointment;
import com.sjsu.edu.vms.model.Vaccination;
import com.sjsu.edu.vms.model.POJOs.VaccinationDue;
import com.sjsu.edu.vms.repository.AppointmentRepository;
import com.sjsu.edu.vms.repository.VaccinationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

  @Autowired
  private AppointmentRepository appointmentRepository;

  @Autowired
  private VaccinationRepository vaccinationRepository;

  public ResponseEntity<?> getPastAppointments(String patientId, Date currentDateFromApp) {
    List<Appointment> findAllAppointments = appointmentRepository.findByPatientId(patientId);
    findAllAppointments = findAllAppointments.stream()
        .filter(
            appointment -> ((appointment.getAppointmentDate().before(currentDateFromApp)
                || appointment.getAppointmentDate().equals(currentDateFromApp))))
        .collect(Collectors.toList());
    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(findAllAppointments);
  }

  public ResponseEntity<?> getScheduledAppointments(String patientId) {
    List<Appointment> findAllAppointments = appointmentRepository.findByPatientId(patientId);
    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(findAllAppointments);
  }

  public ResponseEntity<?> calcApptDue(String patientId, Date currentDateFromApp) {
    List<Appointment> findAllAppointments = appointmentRepository.findByPatientId(patientId);
    List<String> vaccinationIdsForAppointments = new ArrayList<>();
    for (Appointment appointment : findAllAppointments) {
      for (Vaccination vaccination : appointment.getVaccinations()) {
        vaccinationIdsForAppointments.add(vaccination.getId());
      }
    }
    List<Vaccination> vaccinesNotChosenByUser = vaccinationRepository.findAll();
    vaccinesNotChosenByUser = vaccinesNotChosenByUser.stream()
        .filter(
            vaccine -> (!vaccinationIdsForAppointments.contains(vaccine.getId())))
        .collect(Collectors.toList());
    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(vaccinesNotChosenByUser);
  }

  public ResponseEntity<?> getAllAppointmentByPatientId(String patientId, Date currentDateFromApp) {
    List<Appointment> findAllAppointments = appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patientId);
    // findAllAppointments = findAllAppointments.stream()
    // .filter(
    // appointment -> ((appointment.getAppointmentDate().after(currentDateFromApp)
    // || appointment.getAppointmentDate().equals(currentDateFromApp)) &&
    // appointment.isHasCheckedIn()))
    // .collect(Collectors.toList());
    findAllAppointments = findAllAppointments.stream()
        .filter(
            appointment -> (appointment.isHasCheckedIn()))
        .collect(Collectors.toList());
    List<VaccinationDue> vaccinationDues = new ArrayList<>();

    for (Appointment appointment : findAllAppointments) {
      List<Vaccination> appointmeVaccinations = appointment.getVaccinations();
      for (Vaccination vaccination : appointmeVaccinations) {
        boolean isFound = isVaccinationFound(vaccinationDues, vaccination.getId());
        if (!isFound) {
          VaccinationDue newElement = new VaccinationDue();
          newElement.setCountPending(vaccination.getNumberOfShots() - 1);
          newElement.setDuration(vaccination.getDuration());
          newElement.setLatestDate(appointment.getAppointmentDate());
          newElement.setId(vaccination.getId());
          vaccinationDues.add(newElement);
        } else {
          for (VaccinationDue vaccinationDue : vaccinationDues) {
            if (vaccination.getId().equals(vaccinationDue.getId())) {
              vaccinationDue.setCountPending(vaccinationDue.getCountPending() - 1);
            }
          }
        }
      }
    }
    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(vaccinationDues);
  }

  public boolean isVaccinationFound(List<VaccinationDue> vaccinationDues, String vaccinationId) {
    for (VaccinationDue vaccinationDue : vaccinationDues) {
      if (vaccinationDue.getId().equals(vaccinationId)) {
        return true;
      }
    }
    return false;
  }
}
