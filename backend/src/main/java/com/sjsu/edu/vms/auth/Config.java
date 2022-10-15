package com.sjsu.edu.vms.auth;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@NoArgsConstructor
@Component
public class Config {
    @Value("${application.url.frontend:http://localhost:3000/}")
    private String frontEndURL;

    @Value("${application.url.backend:http://localhost:8089/}")
    private String backEndURL;
}
