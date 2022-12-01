package com.sjsu.edu.vms.auth;

import com.sjsu.edu.vms.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class UserDetailsImpl extends User implements UserDetails {

    private boolean enabled = false;

    public UserDetailsImpl(final User user) {
        super(user.getEmail(), user.getPassword(), user.getRole(), user.getPasscode());
        enabled = user.isEnabled();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return Stream.of(getRole())
                .map(role -> new SimpleGrantedAuthority("ROLE_" +getRole()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}
