package com.sjsu.edu.vms.model.POJOs;

import lombok.Data;

@Data
public class ClinicData {
  private String name;
  private String address;
  private String city;
  private String state;
  private String zipCode;
  private int businessStartHours;
  private int businessEndHours;
  private int numberOfPhysicians;
}
