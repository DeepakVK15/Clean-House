package com.sjsu.edu.vms.service;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import com.sjsu.edu.vms.model.Appointment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public boolean sendConfirmationEmail(String receiver, String type, Appointment appointment)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = receiver;
        String fromAddress = "donotreply@vmws.com";
        String senderName = "VMS";
        String subject = "Check in confirmation";
        String content = "";
        if (type.isEmpty()) {
            return false;
        }
        switch (type) {
            case "checkin":
                content = "Dear user,<br>"
                        + "Thank you for checking in for your visit with ID [[appointmentId]] dated [[date]]."
                        + "<br> We will see you soon! Stay Safe, Stay Healthy!<br>"
                        + "Best,<br>"
                        + "VMS";
                break;
            case "make":
                subject = "Appointment Confirmation";
                content = "Dear user,<br>"
                        + "Thank you for booking your visit with us. Your appointment ID is [[appointmentId]]."
                        + "<br> We will see you soon! Stay Safe, Stay Healthy!<br>"
                        + "Best,<br>"
                        + "VMS";
                break;
            case "update":
                subject = "Appointment Update Confirmation";
                content = "Dear user,<br>"
                        + "This is a confirmation on changing your appointment [[appointmentId]]."
                        + "<br> We will see you soon! Stay Safe, Stay Healthy!<br>"
                        + "Best,<br>"
                        + "VMS";
                break;
            case "cancel":
                subject = "Appointment Cancel Confirmation";
                content = "Dear user,<br>"
                        + "This is a confirmation of cancellation of your appointment [[appointmentId]]."
                        + "<br>  Stay Safe, Stay Healthy!<br>"
                        + "Best,<br>"
                        + "VMS";
                break;

            default:

                break;
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[appointmentId]]", appointment.getId());
        if (type.equals("checkin")) {
            content = content.replace("[[date]]", appointment.getAppointmentDate().toString().substring(0, 10) + " "
                    + appointment.getTimeSlot() + " PST");
        }

        helper.setText(content, true);

        mailSender.send(message);
        return true;

    }

}
