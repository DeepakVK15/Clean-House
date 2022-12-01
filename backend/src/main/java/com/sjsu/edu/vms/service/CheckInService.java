package com.sjsu.edu.vms.service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.sjsu.edu.vms.exception.BadRequest;
import com.sjsu.edu.vms.model.Appointment;
import com.sjsu.edu.vms.repository.CheckInRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CheckInService {
    @Autowired
    CheckInRepository checkInRepository;

    public ResponseEntity<?> getAllAppointmentByPatientId(String patientId, Date currentDateFromApp) {
        List<Appointment> findAllAppointments = checkInRepository.findByPatientId(patientId);

        findAllAppointments = findAllAppointments.stream()
                .filter(appointment -> isValidTime(appointment.getAppointmentDate(), currentDateFromApp))
                .collect(Collectors.toList());
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(findAllAppointments);
    }

    public ResponseEntity<?> getPatientNoShowApts(String patientId, Date currentDateFromApp) {
        List<Appointment> findAllAppointments = checkInRepository.findByPatientId(patientId);
        findAllAppointments = findAllAppointments.stream()
                .filter(appointment -> isPastTime(appointment.getAppointmentDate(),
                        currentDateFromApp) && !appointment.isAppointmentCompleted())
                .collect(Collectors.toList());
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(findAllAppointments);
    }

    public ResponseEntity<?> updateCheckInByAptId(String appointmentId, Date currentDateFromApp) {
        Optional<Appointment> appointment = checkInRepository.findById(appointmentId);
        if (appointment.isPresent()) {
            if (isValidTime(appointment.get().getAppointmentDate(), currentDateFromApp)) {
                if (appointment.get().isHasCheckedIn()) {
                    return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                            .body(new BadRequest("407",
                                    "Appointment has already been checked in"));
                }
                appointment.get().setHasCheckedIn(true);
                appointment.get().setAppointmentCompleted(true);
                checkInRepository.save(appointment.get());

                return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(appointment.get());
            } else {
                return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                        .body(new BadRequest("400",
                                "Appointment with does not qualify for checkin at this point in time"));
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new BadRequest("404", "Appointment with ID:" + appointmentId + " not found."));
    }

    private boolean isPastTime(Date prevDate, Date currentDate) {

        if (prevDate.before(currentDate))
            return true;

        return false;
    }

    private boolean isValidTime(Date date, Date systemDate) {
        // Timestamp timestamp = new Timestamp(System.currentTimeMillis());

        long difference_In_Time = date.getTime() - systemDate.getTime();
        long difference_In_Hours = (difference_In_Time
                / (1000 * 60 * 60))
                % 24;
        long difference_In_Years = (difference_In_Time / (1000l * 60 * 60 * 24 *
                365));

        long difference_In_Days = (difference_In_Time
                / (1000 * 60 * 60 * 24))
                % 365;

        return (difference_In_Years == 0 && difference_In_Days == 0 && difference_In_Hours >= 0
                && difference_In_Hours <= 24);

    }
}
