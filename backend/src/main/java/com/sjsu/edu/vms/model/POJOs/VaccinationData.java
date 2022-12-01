package com.sjsu.edu.vms.model.POJOs;

import java.util.List;

import lombok.Data;

@Data
public class VaccinationData {
  private String name;
  private List<String> diseases;
  private String manufacturer;
  private int numberOfShots;
  private int shotInternalVal;
  private int duration;
}
