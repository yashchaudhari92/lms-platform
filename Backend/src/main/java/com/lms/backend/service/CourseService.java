package com.lms.backend.service;

import com.lms.backend.model.Course;
import java.util.List;

public interface CourseService {
    Course createCourse(Course course);
    Course updateCourse(Long id, Course updatedCourse);
    void deleteCourse(Long id);
    List<Course> getAllCourses();
    Course getCourseById(Long id);
}
