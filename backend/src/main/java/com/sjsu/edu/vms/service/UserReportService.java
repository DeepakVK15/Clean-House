package com.sjsu.edu.vms.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.sjsu.edu.vms.exception.BadRequest;
import com.sjsu.edu.vms.model.Appointment;
import com.sjsu.edu.vms.model.UserReport;
import com.sjsu.edu.vms.repository.CheckInRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserReportService {

        @Autowired
        private CheckInRepository checkInRepository;

        public ResponseEntity<?> generateUserReport(String patientId, String startDate, String endDate,
                        String systemDate)
                        throws ParseException {

                UserReport userReport = new UserReport();
                long no_sys_start = ChronoUnit.MONTHS.between(LocalDate.parse(systemDate), LocalDate.parse(startDate));
                long no_sys_end = ChronoUnit.MONTHS.between(LocalDate.parse(systemDate), LocalDate.parse(endDate));
                if (no_sys_start > 12 || no_sys_end > 12)
                        return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                                        .body(new BadRequest("400",
                                                        "Choose a different date range within 12 months of system date"));

                Date start = new SimpleDateFormat("yyyy-MM-dd").parse(startDate);
                Date end = new SimpleDateFormat("yyyy-MM-dd").parse(endDate);
                Date system = new SimpleDateFormat("yyyy-MM-dd").parse(systemDate);
                List<Appointment> allAppointments = checkInRepository.findByPatientId(patientId);

                List<Appointment> findAllInRange = allAppointments.stream()
                                .filter(appointment -> appointment.getAppointmentDate().after(start)
                                                && appointment.getAppointmentDate().before(end))
                                .collect(Collectors.toList());

                List<Appointment> findNoShows = findAllInRange.stream()
                                .filter(appointment -> !appointment.isAppointmentCompleted())
                                .collect(Collectors.toList());

                List<Appointment> futureUnchecked = findAllInRange.stream().filter(
                                appointment -> (appointment.getAppointmentDate().after(system)
                                                && !appointment.isHasCheckedIn()))
                                .collect(Collectors.toList());

                int futureUncheckedApt = futureUnchecked.size();
                int count_apt_no_shows = (findNoShows.size() - futureUncheckedApt);
                int count_apt_in_range = findAllInRange.size();
                double rate = (double) count_apt_no_shows / (double) count_apt_in_range;
                userReport.setFutureUncheckedinApts(futureUncheckedApt);
                userReport.setNoOfAppointments(count_apt_in_range);
                userReport.setNoOfNoShow(count_apt_no_shows > 0 ? count_apt_no_shows : 0);
                userReport.setRate(rate);
                return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(userReport);
        }

        public ResponseEntity<?> generateAdminReport(String clinicId, String startDate, String endDate,
                        String systemDate)
                        throws ParseException {

                UserReport userReport = new UserReport();
                long no_sys_start = ChronoUnit.MONTHS.between(LocalDate.parse(systemDate), LocalDate.parse(startDate));
                long no_sys_end = ChronoUnit.MONTHS.between(LocalDate.parse(systemDate), LocalDate.parse(endDate));
                if (no_sys_start > 12 || no_sys_end > 12)
                        return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                                        .body(new BadRequest("400",
                                                        "Choose a different date range within 12 months of system date"));

                Date start = new SimpleDateFormat("yyyy-MM-dd").parse(startDate);
                Date end = new SimpleDateFormat("yyyy-MM-dd").parse(endDate);
                Date system = new SimpleDateFormat("yyyy-MM-dd").parse(systemDate);
                List<Appointment> allAppointments = checkInRepository.findByClinicId(clinicId);

                List<Appointment> findAllInRange = allAppointments.stream()
                                .filter(appointment -> appointment.getAppointmentDate().after(start)
                                                && appointment.getAppointmentDate().before(end))
                                .collect(Collectors.toList());

                List<Appointment> findNoShows = findAllInRange.stream()
                                .filter(appointment -> !appointment.isAppointmentCompleted())
                                .collect(Collectors.toList());

                List<Appointment> futureUnchecked = findAllInRange.stream().filter(
                                appointment -> (appointment.getAppointmentDate().after(system)
                                                && !appointment.isHasCheckedIn()))
                                .collect(Collectors.toList());

                int futureUncheckedApt = futureUnchecked.size();
                int count_apt_no_shows = (findNoShows.size() - futureUncheckedApt);
                int count_apt_in_range = findAllInRange.size();
                double rate = (double) count_apt_no_shows / (double) count_apt_in_range;
                userReport.setFutureUncheckedinApts(futureUncheckedApt);
                userReport.setNoOfAppointments(count_apt_in_range);
                userReport.setNoOfNoShow(count_apt_no_shows > 0 ? count_apt_no_shows : 0);
                userReport.setRate(rate);
                return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(userReport);
        }

}
