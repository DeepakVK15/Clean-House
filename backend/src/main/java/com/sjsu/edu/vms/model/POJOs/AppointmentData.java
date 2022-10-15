package com.sjsu.edu.vms.model.POJOs;

import java.util.List;

import lombok.Data;

@Data
public class AppointmentData {
  private String patientId;
  private String clinicId;
  private String appointmentDate;
  private String timeSlot;
  private List<String> vaccinations;
}
