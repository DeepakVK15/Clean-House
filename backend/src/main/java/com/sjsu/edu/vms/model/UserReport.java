package com.sjsu.edu.vms.model;

import lombok.Data;

@Data
public class UserReport {

    private int noOfAppointments;
    private int noOfNoShow;
    private int futureUncheckedinApts;
    private double rate;

}
