package com.sjsu.edu.vms.controller;

import com.sjsu.edu.vms.auth.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class Oauth2Controller {

    @Autowired
    Config config;

    @GetMapping(value="/userInfo")
    public void getUserInfo(@RequestParam("state") String state, @RequestParam("code") String code, @RequestParam("scope") String scope) {
        System.out.println(state);
        System.out.println(code);
        System.out.println(scope);
        String clientId = "764804901350-gt40h9hs5keh26bki56upr9fck9781js.apps.googleusercontent.com";
        String secret = "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";
        ResponseEntity<String> response = null;
        System.out.println("Authorization Code------" + code);

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();


        HttpEntity<String> request = new HttpEntity<>(headers);

        String access_token_url = "https://accounts.google.com/o/oauth2/token?";
        access_token_url += "code=" + code;
        access_token_url += "&grant_type=authorization_code";
        access_token_url += "&redirect_uri="+config.getBackEndURL()+"userInfo";
        access_token_url += "&client_id="+clientId;
        access_token_url += "&client_secret="+secret;

        response = restTemplate.exchange(access_token_url, HttpMethod.POST, request, String.class);

        System.out.println("Access Token Response ---------" + response.getBody());

        int index = response.getBody().indexOf("id_token");

        String jwt = response.getBody().substring(index+12);

        System.out.println("Bearer "+jwt);

    }


}
