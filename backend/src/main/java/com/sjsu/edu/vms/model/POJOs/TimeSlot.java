package com.sjsu.edu.vms.model.POJOs;

import lombok.Data;

@Data
public class TimeSlot {
  private String slot;
  private boolean isFull;
  private int remaining;
}
