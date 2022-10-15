package com.sjsu.edu.vms.controller;

import com.sjsu.edu.vms.auth.Config;
import com.sjsu.edu.vms.auth.LoginRequest;
import com.sjsu.edu.vms.model.User;
import com.sjsu.edu.vms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    Config urlConfig;

    @RequestMapping(value = "register", method = RequestMethod.POST)
    public ResponseEntity<?> signup(@RequestParam("email") String email, @RequestParam("password") String password,
            @RequestParam("fName") String fName, @RequestParam("lName") String lName, @RequestParam(value = "address", required = false) String address,
            @RequestParam("gender") String gender, @RequestParam("dob") String dob, @RequestParam(value = "mName",required = false, defaultValue = "") String mName, @RequestParam(value = "city", defaultValue = "San Jose") String city, @RequestParam(value="state", defaultValue = "California") String state, @RequestParam(value ="zip", defaultValue = "95134") String zip, HttpServletRequest request)
            throws ParseException, MessagingException, UnsupportedEncodingException {
        return userService.createUser(email, password, fName, mName, lName, gender, dob, address, city, state, zip, getSiteURL(request));
    }

    @RequestMapping(value = "login", method = RequestMethod.POST)
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest.getEmail(), loginRequest.getPassword());
    }

    @GetMapping("verify")
    public String verifyUser(@RequestParam("code") String code) {
        if (userService.verify(code)) {
            return "<html>\n" +
                    "    <body>\n" +
                    "        <p>Verification Successful.</p>\n" +
                    "<a href="+urlConfig.getFrontEndURL()+" target='_blank'>Login</a>" +
                    "    </body>\n" +
                    "</html>\n";
        } else {
            return "<html>\n" +
                    "    <body>\n" +
                    "        <p>Verification Failed</p>\n" +
                    "    </body>\n" +
                    "</html>\n";
        }
    }

    @RequestMapping(value = "user", method = RequestMethod.POST)
    public ResponseEntity<?> getUser(@RequestParam("email") String email, @RequestParam("fName") String fName,
            @RequestParam("lName") String lName, HttpServletRequest request)
            throws MessagingException, UnsupportedEncodingException {
        Optional<User> user = userService.findByEmail(email);

        if (user.isPresent()) {
            return userService.login(email, user.get().getPasscode());
        }

        return userService.validateUserInfo(email, fName, lName, getSiteURL(request));
    }

    @RequestMapping(value = "user/info", method = RequestMethod.POST)
    public ResponseEntity<?> getUser(@RequestParam String email) {
        return userService.getUserInfo(email);
    }

    private String getSiteURL(HttpServletRequest request) {
        String siteURL = request.getRequestURL().toString();
        System.out.println(siteURL.replace(request.getServletPath(), ""));
        return siteURL.replace(request.getServletPath(), "");
    }
}
