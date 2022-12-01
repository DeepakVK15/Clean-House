package com.sjsu.edu.vms.service;

import com.sjsu.edu.vms.auth.JwtAuthenticationResponse;
import com.sjsu.edu.vms.auth.JwtTokenProvider;
import com.sjsu.edu.vms.exception.BadRequest;
import com.sjsu.edu.vms.model.Address;
import com.sjsu.edu.vms.model.User;
import com.sjsu.edu.vms.repository.UserRepository;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private JavaMailSender mailSender;

    public ResponseEntity<?> createUser(String email, String password, String fName, String mName,String lName, String gender,
            String dob, String address, String city, String state, String zip,String siteURL) throws ParseException, MessagingException, UnsupportedEncodingException {

        if (userRepository.findByEmail(email).isPresent())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).contentType(MediaType.APPLICATION_JSON)
                    .body(new BadRequest("400", "Email Already in use"));

        String mrn = String.valueOf(ThreadLocalRandom.current().nextInt(99, 99999999));
        String[] str = email.split("@");
        String role = "patient";
        if (str[1].equals("sjsu.edu")) {
            role = "admin";
        }
        String randomCode = RandomString.make(64);

        User user = new User(email, passwordEncoder.encode(password), fName, mName, lName, gender,
                new SimpleDateFormat("yyyy-MM-dd").parse(dob), new Address(address, city, state, zip), mrn, role, password);
        user.setVerificationCode(randomCode);
        user.setEnabled(false);
        userRepository.save(user);

        sendVerificationEmail(user, siteURL);

        return ResponseEntity.status(HttpStatus.ACCEPTED).contentType(MediaType.TEXT_PLAIN)
                .body("Account Created");

    }

    public ResponseEntity<?> login(String username, String password) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(username, password));

        Optional<User> user = userRepository.findByEmail(username);

        if (!user.isPresent())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).contentType(MediaType.TEXT_PLAIN)
                    .body("User with this email does not exist.");

        if (!user.get().isEnabled())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).contentType(MediaType.TEXT_PLAIN)
                    .body("Verify Email");

        return ResponseEntity.ok(new JwtAuthenticationResponse(tokenProvider.generateToken(authentication)));
    }

    public ResponseEntity<?> validateUserInfo(String email, String fName, String lName, String siteURL)
            throws MessagingException, UnsupportedEncodingException {
        Optional<User> userOptional = findByEmail(email);
        User user = userOptional.orElse(null);

        if (user == null) {
            String randomCode = RandomString.make(64);
            String mrn = String.valueOf(ThreadLocalRandom.current().nextInt(99, 99999999));
            String[] str = email.split("@");
            String role = "patient";
            if (str[1].equals("sjsu.edu")) {
                role = "admin";
            }
            String password = passwordEncoder.encode("password");
            User newUser = new User(email, password, fName, lName, mrn, role, "password");
            newUser.setEnabled(false);
            newUser.setVerificationCode(randomCode);
            userRepository.save(newUser);
            sendVerificationEmail(newUser, siteURL);

            return ResponseEntity.status(HttpStatus.ACCEPTED).contentType(MediaType.TEXT_PLAIN)
                    .body("Account Created");
        }

        if (user.isEnabled()) {
            String password = user.getPassword() == null ? "password" : user.getPassword();

            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(email, password));
            return ResponseEntity.ok(new JwtAuthenticationResponse(tokenProvider.generateToken(authentication)));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).contentType(MediaType.TEXT_PLAIN)
                    .body("Verify Email");
        }
    }

    public Optional<User> findByEmail(String email) {

        return userRepository.findByEmail(email);
    }

    public ResponseEntity<?> getUserInfo(String email) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(userRepository.findByEmail(email));
    }

    private void sendVerificationEmail(User user, String siteURL)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = user.getEmail();
        String senderName = "VMS";
        String subject = "Confirm Registration";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "VMS";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        String fName = user.getFirstName() != null ? user.getFirstName() : "";
        String lName = user.getLastName() != null ? user.getLastName() : "";

        content = content.replace("[[name]]", fName +" "+ lName);
        String verifyURL = siteURL + "/api/auth/verify?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);

    }

    public boolean verify(String verificationCode) {
        User user = userRepository.findByVerificationCode(verificationCode);

        if (user == null || user.isEnabled()) {
            return false;
        } else {
            user.setVerificationCode(null);
            user.setEnabled(true);
            userRepository.save(user);

            return true;
        }

    }

}
