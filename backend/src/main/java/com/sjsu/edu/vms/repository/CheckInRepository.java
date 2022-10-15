package com.sjsu.edu.vms.repository;

import java.util.List;

import com.sjsu.edu.vms.model.Appointment;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckInRepository extends CrudRepository<Appointment, String> {

    List<Appointment> findByPatientId(String patientId);

    List<Appointment> findByClinicId(String clinicId);

}
