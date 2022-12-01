package com.sjsu.edu.vms.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.sjsu.edu.vms.model.Appointment;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends CrudRepository<Appointment, String> {

  @Query("SELECT a FROM Appointment a WHERE a.id=?2 AND a.patientId=?1")
  Optional<Appointment> findOnePatientAppointment(String patientId, String appointmentId);

  @Query("SELECT a FROM Appointment a WHERE a.clinicId=?1 AND DATE(a.appointmentDate)=?2")
  List<Appointment> findByClinicId(String clinicId, Date appointmentDate);

  @Query("SELECT a FROM Appointment a WHERE a.patientId=?1 AND a.hasCheckedIn=true ORDER BY a.appointmentDate DESC")
  public List<Appointment> findCheckInByPatientId(String patientId);

  @Query("SELECT a FROM Appointment a WHERE a.patientId=?1 AND a.isAppointmentCompleted=false ORDER BY a.appointmentDate")
  public List<Appointment> findFutureAppointmentsForPatient(String patientId);

  @Query("SELECT a FROM Appointment a WHERE a.patientId=?1 AND a.isAppointmentCompleted=true ORDER BY a.appointmentDate DESC")
  public List<Appointment> findPastAppointmentsForPatient(String patientId);

  @Query("SELECT a FROM Appointment a WHERE a.patientId=?1 AND a.appointmentDate >= ?2 ORDER BY a.appointmentDate")
  public List<Appointment> findFutureAppointmentsBasedOnDate(String patientId, Date date);

  @Query("SELECT a FROM Appointment a WHERE a.patientId=?1 AND a.appointmentDate < ?2 ORDER BY a.appointmentDate DESC")
  public List<Appointment> findPastAppointmentsBasedOnDate(String patientId, Date date);

  @Query("SELECT a FROM Appointment a WHERE a.patientId=?1 AND DATE(a.appointmentDate)=?2")
  public List<Appointment> findAppointmentsForPatientOnAParticularDate(
      String patientId, Date appointmentDate);

  @Query(value = "select a.id,  a.appointment_date , c.name as clinic_name,c.city,c.state,c.zipcode ,c.street, v.name from appointment a,appointment_vaccinations av, clinic c,vaccination v where a.patient_id=?1 and a.id = av.appointment_id and a.clinic_id = c.id and v.id=av.vaccinations_id;", nativeQuery = true)
  public List<Object> findAllAppointments(String code);

  List<Appointment> findByPatientIdOrderByAppointmentDateDesc(String patientId);

  List<Appointment> findByPatientId(String patientId);
}
