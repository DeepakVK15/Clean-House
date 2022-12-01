package com.sjsu.edu.vms.service;

import com.sjsu.edu.vms.exception.BadRequest;
import com.sjsu.edu.vms.model.Address;
import com.sjsu.edu.vms.model.Appointment;
import com.sjsu.edu.vms.model.Clinic;
import com.sjsu.edu.vms.model.POJOs.ClinicData;
import com.sjsu.edu.vms.model.POJOs.TimeSlot;
import com.sjsu.edu.vms.repository.ClinicRepository;
import com.sjsu.edu.vms.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class ClinicService {

    @Autowired
    private ClinicRepository clinicRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public ResponseEntity<?> createClinic(ClinicData clinicData) {
        Address clinicAddress = new Address(clinicData.getAddress(), clinicData.getCity(), clinicData.getState(),
                clinicData.getZipCode());
        Clinic clinic = new Clinic(clinicData.getName(), clinicData.getBusinessStartHours(),
                clinicData.getBusinessEndHours(), clinicData.getNumberOfPhysicians(), clinicAddress);
        clinicRepository.save(clinic);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(clinic);
    }

    public ResponseEntity<?> getClinicById(String id) {
        Optional<Clinic> clinic = clinicRepository.findById(id);
        if (clinic.isPresent())
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(clinic.get());

        return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                .body(new BadRequest("404", "Clinic with ID: " + id + " not found."));

    }

    public ResponseEntity<?> getAllClinics(Optional<String> search) {
        List<Clinic> clinics;
        if (search.isPresent()) {
            clinics = clinicRepository.findAllBySearch(search.get());
        } else {
            clinics = clinicRepository.findAll();
        }
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(clinics);
    }

    public ResponseEntity<?> getClinicTimeSlots(String id, String appointmentDate) {
        Optional<Clinic> clinic = clinicRepository.findById(id);
        if (!clinic.isPresent()) {
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                    .body(new BadRequest("400", "Clinic with ID: " + id + " not found."));
        }

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        try {
            Date date = formatter.parse(appointmentDate);
            List<Appointment> appointments = appointmentRepository.findByClinicId(id, date);
            HashMap<String, Integer> bookedSlotsSet = new HashMap<String, Integer>();
            for (Appointment appt : appointments) {
                bookedSlotsSet.put(
                        appt.getTimeSlot(),
                        bookedSlotsSet.getOrDefault(appt.getTimeSlot(), 0) + 1);
            }

            List<TimeSlot> timeSlots = new ArrayList<TimeSlot>();

            int startHour = clinic.get().getBusinessStartHours();
            int endHour = clinic.get().getBusinessEndHours();
            endHour = endHour < startHour ? endHour + 24 : endHour;

            // taking max to show slots only before midnight since after that
            // slots go to next day
            for (int i = startHour; i < Math.min(endHour, 23); i++) {
                for (int j = 0; j <= 3; j++) {
                    String slot = String.format("%02d:%02d", i, j * 15);
                    TimeSlot timeSlot = new TimeSlot();
                    timeSlot.setFull(bookedSlotsSet.getOrDefault(slot, 0) >= clinic.get().getNumberOfPhysicians());
                    timeSlot.setSlot(slot);
                    timeSlot.setRemaining(clinic.get().getNumberOfPhysicians() - bookedSlotsSet.getOrDefault(slot, 0));

                    timeSlots.add(timeSlot);
                }
            }

            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(timeSlots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                    .body(new BadRequest("400", "Date is not in correct format."));
        }
    }

}
