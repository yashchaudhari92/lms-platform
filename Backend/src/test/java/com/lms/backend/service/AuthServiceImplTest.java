package com.lms.backend.service;

import com.lms.backend.model.User;
import com.lms.backend.model.Role;
import com.lms.backend.model.Role.RoleName;
import com.lms.backend.dto.SignupRequest;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.repository.RoleRepository;
import com.lms.backend.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void testRegisterUser_Success() {
        // Setup
        SignupRequest signupRequest = SignupRequest.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .role("ROLE_STUDENT")
                .build();

        Role studentRole = Role.builder()
                .id(1L)
                .name(RoleName.ROLE_STUDENT)
                .build();

        User savedUser = new User();
        savedUser.setUsername("testuser");
        savedUser.setEmail("test@example.com");
        savedUser.setPassword("encodedPassword");
        savedUser.setRole(studentRole);

        // Mock only required calls - REMOVED unnecessary stubbing
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_STUDENT)).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Execute
        User result = authService.registerUser(signupRequest);

        // Verify
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertEquals("testuser", result.getUsername());
        assertEquals(RoleName.ROLE_STUDENT, result.getRole().getName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        // Setup
        SignupRequest signupRequest = SignupRequest.builder()
                .username("testuser")
                .email("existing@example.com")
                .password("password123")
                .role("ROLE_STUDENT")
                .build();

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Execute & Verify
        assertThrows(RuntimeException.class, () -> {
            authService.registerUser(signupRequest);
        });

        verify(userRepository, never()).save(any(User.class));
    }
}