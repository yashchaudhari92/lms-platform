package com.lms.backend.controller;

import com.lms.backend.dto.LoginRequest;
import com.lms.backend.dto.SignupRequest;
import com.lms.backend.model.Role;
import com.lms.backend.model.User;
import com.lms.backend.repository.RoleRepository;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        try {
            // Check if email exists
            if (userRepository.existsByEmail(request.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email already exists!");
                return ResponseEntity.badRequest().body(response);
            }

            // Always set role to STUDENT for signup
            Role role = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                    .orElseGet(() -> {
                        Role newRole = Role.builder().name(Role.RoleName.ROLE_STUDENT).build();
                        return roleRepository.save(newRole);
                    });

            // Create user
            User user = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(role)
                    .build();

            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Generate token
            String token = jwtTokenProvider.generateToken(authentication);

            // Get user details for response
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("email", user.getEmail());
            response.put("username", user.getUsername());
            response.put("role", user.getRole().getName().name());
            response.put("message", "Login successful!");

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException ex) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid email or password!");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception ex) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login failed: " + ex.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}