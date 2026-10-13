package com.lms.backend.service;

import com.lms.backend.model.Course;
import com.lms.backend.model.User;
import com.lms.backend.model.Role;
import com.lms.backend.model.Role.RoleName;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.service.impl.CourseServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceImplTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseServiceImpl courseService;

    @Test
    void testCreateCourse_Success() {
        // Setup
        Course course = new Course();
        course.setTitle("Java Programming");
        course.setDescription("Learn Java");

        when(courseRepository.save(any(Course.class))).thenReturn(course);

        // Execute - Only pass course object
        Course result = courseService.createCourse(course);

        // Verify
        assertNotNull(result);
        assertEquals("Java Programming", result.getTitle());
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void testGetCourseById_Success() {
        // Setup
        Course course = new Course();
        course.setId(1L);
        course.setTitle("Java Programming");
        course.setDescription("Learn Java");

        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // Execute
        Course result = courseService.getCourseById(1L);

        // Verify
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Java Programming", result.getTitle());
    }

    @Test
    void testGetCourseById_NotFound() {
        // Setup
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        // Execute & Verify
        assertThrows(RuntimeException.class, () -> {
            courseService.getCourseById(1L);
        });
    }

    @Test
    void testGetAllCourses_Success() {
        // Setup
        Course course1 = new Course();
        course1.setId(1L);
        course1.setTitle("Java Programming");

        Course course2 = new Course();
        course2.setId(2L);
        course2.setTitle("Spring Boot");

        when(courseRepository.findAll()).thenReturn(List.of(course1, course2));

        // Execute
        List<Course> result = courseService.getAllCourses();

        // Verify
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(courseRepository).findAll();
    }

    @Test
    void testUpdateCourse_Success() {
        // Setup
        Course existingCourse = new Course();
        existingCourse.setId(1L);
        existingCourse.setTitle("Old Title");
        existingCourse.setDescription("Old Description");
        existingCourse.setCoverImageUrl("old.jpg");
        existingCourse.setApproved(false);

        Course updatedCourse = new Course();
        updatedCourse.setTitle("New Title");
        updatedCourse.setDescription("New Description");
        updatedCourse.setCoverImageUrl("new.jpg");
        updatedCourse.setApproved(true);

        when(courseRepository.findById(1L)).thenReturn(Optional.of(existingCourse));
        when(courseRepository.save(any(Course.class))).thenReturn(existingCourse);

        // Execute
        Course result = courseService.updateCourse(1L, updatedCourse);

        // Verify
        assertNotNull(result);
        assertEquals("New Title", result.getTitle());
        assertEquals("New Description", result.getDescription());
        assertEquals("new.jpg", result.getCoverImageUrl());
        assertTrue(result.isApproved());
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void testDeleteCourse_Success() {
        // Setup - No return value for delete

        // Execute
        courseService.deleteCourse(1L);

        // Verify
        verify(courseRepository).deleteById(1L);
    }
}