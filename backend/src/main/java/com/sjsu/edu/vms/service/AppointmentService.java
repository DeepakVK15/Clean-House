package com.sjsu.edu.vms.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sjsu.edu.vms.exception.BadRequest;
import com.sjsu.edu.vms.model.Appointment;
import com.sjsu.edu.vms.model.AppointmentDetailResponse;
import com.sjsu.edu.vms.model.Clinic;
import com.sjsu.edu.vms.model.Vaccination;
import com.sjsu.edu.vms.repository.AppointmentRepository;
import com.sjsu.edu.vms.repository.CheckInRepository;
import com.sjsu.edu.vms.repository.VaccinationRepository;
import com.sjsu.edu.vms.repository.ClinicRepository;
import com.sjsu.edu.vms.model.POJOs.AppointmentClinic;
import com.sjsu.edu.vms.model.POJOs.AppointmentData;

import net.minidev.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

//getAllAppointment
@Service
public class AppointmentService {
    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    VaccinationRepository vaccinationRepository;

    @Autowired
    ClinicRepository clinicRepository;

    public ResponseEntity<?> getAppointment(String patientId, String appointmentId) {
        Optional<Appointment> appointment = appointmentRepository.findOnePatientAppointment(patientId, appointmentId);

        if (appointment.isPresent()) {
            Optional<Clinic> clinic = clinicRepository.findById(appointment.get().getClinicId());
            AppointmentClinic apptClinic = new AppointmentClinic();
            apptClinic.setAppointment(appointment.get());
            apptClinic.setClinic(clinic.get());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON).body(apptClinic);
        }

        return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                .body(new BadRequest("400", "No Appointment with ID " + appointmentId + " for patient with ID "
                        + patientId + " is present."));
    }

    public ResponseEntity<?> getAppointmentsForPatient(String patientId, Optional<String> showPast) {
        List<Appointment> appointments;
        if (showPast.isPresent()) {
            appointments = appointmentRepository.findPastAppointmentsForPatient(patientId);
        } else {
            appointments = appointmentRepository.findFutureAppointmentsForPatient(patientId);
        }

        List<String> clinicIds = appointments.stream()
                .map(x -> x.getClinicId()).collect(Collectors.toList());

        List<Clinic> clinics = clinicRepository.findMultipleByIds(clinicIds);

        Map<String, Clinic> clinicMap = new HashMap<String, Clinic>();

        for (Clinic clinic : clinics) {
            clinicMap.put(clinic.getId(), clinic);
        }

        List<AppointmentClinic> apptClinics = new ArrayList<AppointmentClinic>();

        for (Appointment appt : appointments) {
            AppointmentClinic apptClinic = new AppointmentClinic();
            apptClinic.setAppointment(appt);
            apptClinic.setClinic(clinicMap.get(appt.getClinicId()));

            apptClinics.add(apptClinic);
        }

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(apptClinics);
    }

    public ResponseEntity<?> getPastOrFutureAppointmentsForPatient(String patientId, String dateConstraint,
            Optional<String> showPast) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm");
        try {
            Date date = formatter.parse(dateConstraint);

            List<Appointment> appointments;
            if (showPast.isPresent()) {
                appointments = appointmentRepository.findPastAppointmentsBasedOnDate(patientId, date);
            } else {
                appointments = appointmentRepository.findFutureAppointmentsBasedOnDate(patientId, date);
            }

            List<String> clinicIds = appointments.stream()
                    .map(x -> x.getClinicId()).collect(Collectors.toList());

            List<Clinic> clinics = clinicRepository.findMultipleByIds(clinicIds);

            Map<String, Clinic> clinicMap = new HashMap<String, Clinic>();

            for (Clinic clinic : clinics) {
                clinicMap.put(clinic.getId(), clinic);
            }

            List<AppointmentClinic> apptClinics = new ArrayList<AppointmentClinic>();

            for (Appointment appt : appointments) {
                AppointmentClinic apptClinic = new AppointmentClinic();
                apptClinic.setAppointment(appt);
                apptClinic.setClinic(clinicMap.get(appt.getClinicId()));

                apptClinics.add(apptClinic);
            }

            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(apptClinics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                    .body(new BadRequest("400", "Date is not in correct format."));
        }
    }

    public ResponseEntity<?> getPatientAppointmentsOnADate(String patientId, String appointmentDate) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date date = formatter.parse(appointmentDate);
            List<Appointment> appointments = appointmentRepository
                    .findAppointmentsForPatientOnAParticularDate(patientId, date);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                    .body(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                    .body(new BadRequest("400", "Date is not in correct format."));
        }
    }

    public ResponseEntity<?> createAppointment(AppointmentData appointmentData) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        try {
            Date appointmentDate = formatter.parse(appointmentData.getAppointmentDate());
            List<Vaccination> vaccinations = vaccinationRepository.findMultipleByIds(appointmentData.getVaccinations());

            Appointment appointment = new Appointment(appointmentData.getPatientId(), appointmentData.getClinicId(),
                    appointmentDate, appointmentData.getTimeSlot(), vaccinations);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                    .body(appointmentRepository.save(appointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                    .body(new BadRequest("400", "Date is not in correct format."));
        }
    }

    public ResponseEntity<?> cancelAppointment(String appointmentId) {
        Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);

        if (appointment.isPresent()) {
            Appointment appt = appointment.get();
            appt.setCancelled(true);
            appointmentRepository.save(appt);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(appt);
        }

        return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                .body(new BadRequest("400", "No appointment with ID=" + appointmentId + " is present."));
    }

    public ResponseEntity<?> updateAppointment(String appointmentId, AppointmentData appointmentData) {
        Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);

        if (appointment.isPresent()) {
            Appointment appt = appointment.get();
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");

            try {
                Date appointmentDate = formatter.parse(appointmentData.getAppointmentDate());
                List<Vaccination> vaccinations = vaccinationRepository
                        .findMultipleByIds(appointmentData.getVaccinations());

                appt.setAppointmentDate(appointmentDate);
                appt.setClinicId(appointmentData.getClinicId());
                appt.setTimeSlot(appointmentData.getTimeSlot());
                appt.setVaccinations(vaccinations);
                appointmentRepository.save(appt);
                return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(appt);
            } catch (Exception e) {
                return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                        .body(new BadRequest("400", "Date is not in correct format."));
            }
        }

        return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                .body(new BadRequest("400", "No appointment with ID=" + appointmentId + " is present."));
    }
}
