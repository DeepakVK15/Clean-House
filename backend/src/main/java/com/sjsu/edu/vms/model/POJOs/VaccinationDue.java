package com.sjsu.edu.vms.model.POJOs;

import java.util.Date;

import lombok.Data;

@Data
public class VaccinationDue {

    private String id;
    private Date latestDate;
    private int duration;
    private int countPending;

}
