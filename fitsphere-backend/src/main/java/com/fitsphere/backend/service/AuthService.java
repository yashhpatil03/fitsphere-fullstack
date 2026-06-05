package com.fitsphere.backend.service;

import com.fitsphere.backend.dto.LoginRequest;
import com.fitsphere.backend.dto.LoginResponse;
import com.fitsphere.backend.entity.User;
import com.fitsphere.backend.exception.InvalidCredentialsException;
import com.fitsphere.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid credentials"));

        boolean matches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!matches) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getRole()
        );
    }
    public boolean validateToken(String token) {
        return jwtService.isValid(token);
    }

    public String extractEmail(String token) {
        return jwtService.extractEmail(token);
    }


}