
package com.sjsu.edu.vms.model;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.stereotype.Component;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;
import java.sql.Time;
import java.util.Date;
import java.util.List;

@Component
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String id;

    private String patientId;

    private String clinicId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date appointmentDate;

    private String timeSlot;

    // below is for checkin and no show

    private boolean hasCheckedIn = false;

    private boolean isAppointmentCompleted = false;

    private boolean isCancelled = false;

    @ManyToMany(targetEntity = Vaccination.class, cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<Vaccination> vaccinations;

    public Appointment(String patientId, String clinicId, Date appointmentDate, String timeSlot,
            List<Vaccination> vaccinations) {

        this.patientId = patientId;
        this.clinicId = clinicId;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.vaccinations = vaccinations;
    }

    @Override
    public String toString() {
        return "Appointment [appointmentDate=" + appointmentDate
                + ", clinicId=" + clinicId + ", enableCheckIn=" + hasCheckedIn + ", isAppointmentCompleted="
                + isAppointmentCompleted + ", isCancelled=" + isCancelled + ", patientId="
                + patientId + "]";
    }

}
