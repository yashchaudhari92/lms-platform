package com.lms.backend.controller;

import com.lms.backend.dto.CourseDto;
import com.lms.backend.model.User;
import com.lms.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    // Create User Request
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User createdUser = adminService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return "User deleted successfully.";
    }

    @PutMapping("/users/{id}/role")
    public User updateUserRole(@PathVariable Long id, @RequestParam String role) {
        return adminService.updateUserRole(id, role);
    }

    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {
        return adminService.getAdminStats();
    }

    @GetMapping("/activity")
    public List<Map<String, Object>> getRecentActivity() {
        return adminService.getRecentActivity();
    }

    @GetMapping("/courses/pending")
    public List<CourseDto> getPendingCourses() {
        return adminService.getPendingCourses();
    }

    @PutMapping("/courses/{courseId}/approve")
    public CourseDto approveCourse(@PathVariable Long courseId) {
        return adminService.approveCourse(courseId);
    }

    @PutMapping("/courses/{courseId}/reject")
    public CourseDto rejectCourse(@PathVariable Long courseId) {
        return adminService.rejectCourse(courseId);
    }

    public static class CreateUserRequest {
        private String username;
        private String email;
        private String password;
        private String role;

        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}