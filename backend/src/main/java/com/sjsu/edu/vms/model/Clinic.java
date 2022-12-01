package com.sjsu.edu.vms.model;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Component
public class Clinic {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String id;

    @Column(unique = true)
    private String name;
    private int businessStartHours;
    private int businessEndHours;
    private int numberOfPhysicians;

    @Embedded
    private Address address;

    public Clinic(String name, int businessStartHours, int businessEndHours, int numberOfPhysicians,
            Address address) {
        this.name = name;
        this.businessStartHours = businessStartHours;
        this.businessEndHours = businessEndHours;
        this.numberOfPhysicians = numberOfPhysicians;
        this.address = address;
    }

    public Clinic() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getBusinessStartHours() {
        return businessStartHours;
    }

    public void setBusinessStartHours(int businessStartHours) {
        this.businessStartHours = businessStartHours;
    }

    public int getBusinessEndHours() {
        return businessEndHours;
    }

    public void setBusinessEndHours(int businessEndHours) {
        this.businessEndHours = businessEndHours;
    }

    public int getNumberOfPhysicians() {
        return numberOfPhysicians;
    }

    public void setNumberOfPhysicians(int numberOfPhysicians) {
        this.numberOfPhysicians = numberOfPhysicians;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Clinic [" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", businessStartHours='" + businessStartHours + '\'' +
                ", businessEndHours='" + businessEndHours + '\'' +
                ", numberOfPhysicians=" + numberOfPhysicians + '\'' +
                ", address=" + address +
                ']';
    }

}
