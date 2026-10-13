package com.lms.backend.service.impl;

import com.lms.backend.dto.SignupRequest;
import com.lms.backend.model.Role;
import com.lms.backend.model.User;
import com.lms.backend.repository.RoleRepository;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            System.out.println("AUTH DEBUG - Authentication: " + authentication);
            System.out.println("AUTH DEBUG - Name: " + (authentication != null ? authentication.getName() : "NULL"));
            System.out.println("AUTH DEBUG - Authenticated: " + (authentication != null ? authentication.isAuthenticated() : "NULL"));

            if (authentication == null || !authentication.isAuthenticated()) {
                System.out.println("USER NOT AUTHENTICATED");
                throw new RuntimeException("User not authenticated");
            }

            String email = authentication.getName();
            System.out.println("Looking for user with email: " + email);

            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                System.out.println("FOUND USER - ID: " + user.getId() + ", Email: " + user.getEmail());
                return user;
            } else {
                System.out.println("USER NOT FOUND IN DATABASE: " + email);
                throw new RuntimeException("User not found with email: " + email);
            }

        } catch (Exception e) {
            System.out.println("ERROR in getCurrentUser: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    @Override
    public User registerUser(SignupRequest signupRequest) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                throw new RuntimeException("Email already exists: " + signupRequest.getEmail());
            }

            // Get or create STUDENT role
            Role role = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                    .orElseGet(() -> {
                        Role newRole = Role.builder().name(Role.RoleName.ROLE_STUDENT).build();
                        return roleRepository.save(newRole);
                    });

            // Create new user
            User user = User.builder()
                    .username(signupRequest.getUsername())
                    .email(signupRequest.getEmail())
                    .password(passwordEncoder.encode(signupRequest.getPassword()))
                    .role(role)
                    .build();

            User savedUser = userRepository.save(user);
            System.out.println("USER REGISTERED - ID: " + savedUser.getId() + ", Email: " + savedUser.getEmail());

            return savedUser;

        } catch (Exception e) {
            System.out.println("REGISTRATION FAILED: " + e.getMessage());
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
}