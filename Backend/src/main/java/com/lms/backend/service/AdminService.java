package com.lms.backend.service;

import com.lms.backend.controller.AdminController;
import com.lms.backend.dto.CourseDto;
import com.lms.backend.model.User;
import java.util.List;
import java.util.Map;

public interface AdminService {
    List<User> getAllUsers();
    User createUser(AdminController.CreateUserRequest request); // ✅ CHANGE: DTO use karo
    void deleteUser(Long userId);
    User updateUserRole(Long userId, String role);
    Map<String, Object> getAdminStats();
    List<Map<String, Object>> getRecentActivity();


    List<CourseDto> getPendingCourses();
    CourseDto approveCourse(Long courseId);
    CourseDto rejectCourse(Long courseId);
}