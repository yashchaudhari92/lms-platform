// InstructorService.java - UPDATE INTERFACE
package com.lms.backend.service;

import com.lms.backend.model.Course;
import com.lms.backend.model.Lesson;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

public interface InstructorService {
    Course createCourse(Course course, Long instructorId);
    List<Course> getCoursesByInstructor(Long instructorId);
    Course updateCourse(Long courseId, Course updatedCourse);
    void deleteCourse(Long courseId);
    Course getCourseById(Long courseId);

    // LESSON MANAGEMENT METHODS
    Lesson addLesson(Long courseId, Lesson lesson);
    List<Lesson> getLessonsByCourse(Long courseId);
    Lesson updateLesson(Long lessonId, Lesson updatedLesson);
    void deleteLesson(Long lessonId);
    Map<String, Object> getCourseWithStats(Long courseId);
}