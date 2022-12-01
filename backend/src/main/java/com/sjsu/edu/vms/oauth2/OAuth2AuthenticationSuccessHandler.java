package com.sjsu.edu.vms.oauth2;

import com.sjsu.edu.vms.auth.JwtConfig;
import com.sjsu.edu.vms.auth.JwtTokenProvider;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException, IOException {
        String targetUrl = determineTargetUrl(request, response, authentication);
        if (response.isCommitted()) {
            return;
        }

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }


    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        OAuth2AuthenticationToken authenticationToken = (OAuth2AuthenticationToken) authentication;
        Optional<String> redirectUri = CookieUtils.getCookie(request, HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);
        String  firstName = authenticationToken.getPrincipal().getAttributes().get("given_name").toString();
        String email = authenticationToken.getPrincipal().getAttributes().get("email").toString();
        String lastName = authenticationToken.getPrincipal().getAttributes().get("family_name").toString();
        System.out.println(authenticationToken.getPrincipal().getAttributes());

        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());

        String token = generateToken(authenticationToken);
        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("token", token).queryParam("email", email).queryParam("firstName", firstName).queryParam("lastName",lastName).
                build().toUriString();
    }

    private String generateToken(OAuth2AuthenticationToken authentication) {
        long now = System.currentTimeMillis();
        JwtConfig jwtConfig = tokenProvider.getJwtConfig();
        return Jwts.builder()
                .setSubject(authentication.getPrincipal().getAttributes().get("email").toString())
                .claim("authorities", authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + jwtConfig.getExpiration() * 1000L))  // in milliseconds
                .signWith(SignatureAlgorithm.HS512, jwtConfig.getSecret().getBytes())
                .compact();
    }
}
