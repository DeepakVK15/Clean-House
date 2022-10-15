package com.sjsu.edu.vms.model.POJOs;

import com.sjsu.edu.vms.model.Appointment;
import com.sjsu.edu.vms.model.Clinic;

import lombok.Data;

@Data
public class AppointmentClinic {
  private Appointment appointment;
  private Clinic clinic;
}
