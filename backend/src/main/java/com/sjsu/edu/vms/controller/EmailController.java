package com.sjsu.edu.vms.controller;

import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;

import com.sjsu.edu.vms.model.Appointment;
import com.sjsu.edu.vms.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @RequestMapping(value = "/{email}", method = RequestMethod.POST, produces = {
            MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> getAllValidCheckIns(@PathVariable String email, @RequestParam String type,
            @RequestBody Appointment appointment) {
        try {
            if (emailService.sendConfirmationEmail(email, type, appointment)) {
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(null);
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

    }
}
