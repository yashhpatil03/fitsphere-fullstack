package com.fitsphere.backend.controller;

import com.fitsphere.backend.dto.LoginRequest;
import com.fitsphere.backend.dto.LoginResponse;
import com.fitsphere.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody @Valid LoginRequest request) {

        return authService.login(request);
    }
    @GetMapping("/test")
    public Map<String, Object> testToken(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");

        return Map.of(
                "valid", authService.validateToken(token),
                "email", authService.extractEmail(token)
        );
    }
    @GetMapping("/me")
    public Map<String, String> currentUser(Authentication authentication) {
        return Map.of(
                "email", authentication.getName()
        );
    }
}