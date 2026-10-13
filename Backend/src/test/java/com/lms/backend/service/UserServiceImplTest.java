package com.lms.backend.service;

import com.lms.backend.model.User;
import com.lms.backend.model.Role;
import com.lms.backend.model.Role.RoleName;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void testGetAllUsers_Success() {
        // Setup
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("student1");
        user1.setEmail("student1@example.com");
        Role studentRole = Role.builder()
                .name(RoleName.ROLE_STUDENT)
                .build();
        user1.setRole(studentRole);

        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("admin1");
        user2.setEmail("admin@example.com");
        Role adminRole = Role.builder()
                .name(RoleName.ROLE_ADMIN)
                .build();
        user2.setRole(adminRole);

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        // Execute
        List<User> result = userService.getAllUsers();

        // Verify
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void testGetUserById_UserExists() {
        // Setup
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        Role studentRole = Role.builder()
                .name(RoleName.ROLE_STUDENT)
                .build();
        user.setRole(studentRole);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Execute - Directly get User, not Optional
        User result = userService.getUserById(1L);

        // Verify
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("testuser", result.getUsername());
    }

    @Test
    void testGetUserById_UserNotFound() {
        // Setup
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Execute & Verify - Should throw exception
        assertThrows(RuntimeException.class, () -> {
            userService.getUserById(1L);
        });
    }
}