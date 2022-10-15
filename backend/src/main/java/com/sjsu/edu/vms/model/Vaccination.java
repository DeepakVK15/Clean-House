package com.sjsu.edu.vms.model;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.List;

@Entity
@Component

public class Vaccination {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String id;

    @Column(unique = true)
    private String name;

    @ManyToMany(targetEntity = Disease.class, cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<Disease> diseases;

    @ManyToMany(targetEntity = Vaccination.class, cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<Vaccination> vaccinations;

    private String manufacturer;

    private int numberOfShots;

    private int shotInternalVal;

    private int duration;

    public Vaccination(String name, List<Disease> diseases, String manufacturer, int numberOfShots, int shotInternalVal,
            int duration) {
        this.name = name;
        this.diseases = diseases;
        this.manufacturer = manufacturer;
        this.numberOfShots = numberOfShots;
        this.shotInternalVal = shotInternalVal;
        this.duration = duration;
    }

    public Vaccination() {
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

    public List<Disease> getDiseases() {
        return diseases;
    }

    public void setDiseases(List<Disease> diseases) {
        this.diseases = diseases;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public int getNumberOfShots() {
        return numberOfShots;
    }

    public void setNumberOfShots(int numberOfShots) {
        this.numberOfShots = numberOfShots;
    }

    public int getShotInternalVal() {
        return shotInternalVal;
    }

    public void setShotInternalVal(int shotInternalVal) {
        this.shotInternalVal = shotInternalVal;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    @Override
    public String toString() {
        return "Vaccination [" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", diseases=" + diseases +
                ", manufacturer='" + manufacturer + '\'' +
                ", numberOfShots=" + numberOfShots +
                ", shotInternalVal=" + shotInternalVal +
                ", duration=" + duration +
                ']';
    }
}
