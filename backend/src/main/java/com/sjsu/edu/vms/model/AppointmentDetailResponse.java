package com.sjsu.edu.vms.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class AppointmentDetailResponse {
    public String id;
    public String date;
    public String name;
    public String city;
    public String state;
    public String zipcode;
    public String street;
    public String vaccineName;
}
