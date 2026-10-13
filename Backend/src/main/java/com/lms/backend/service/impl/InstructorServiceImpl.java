package com.lms.backend.service.impl;

import com.lms.backend.model.Course;
import com.lms.backend.model.Lesson;
import com.lms.backend.model.User;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.repository.LessonRepository;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class InstructorServiceImpl implements InstructorService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    // CREATE NEW COURSE
    @Override
    public Course createCourse(Course course, Long instructorId) {
        // Find instructor user
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        course.setInstructor(instructor);
        course.setApproved(false); // Default: needs admin approval

        return courseRepository.save(course);
    }

    // GET INSTRUCTOR'S COURSES
    @Override
    public List<Course> getCoursesByInstructor(Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        return courseRepository.findByInstructor(instructor);
    }

    // UPDATE COURSE
    @Override
    public Course updateCourse(Long courseId, Course updatedCourse) {
        Course existingCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Update fields
        existingCourse.setTitle(updatedCourse.getTitle());
        existingCourse.setDescription(updatedCourse.getDescription());
        existingCourse.setPrice(updatedCourse.getPrice());
        existingCourse.setCoverImageUrl(updatedCourse.getCoverImageUrl());

        return courseRepository.save(existingCourse);
    }

    // DELETE COURSE
    @Override
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        courseRepository.delete(course);
    }

    // GET COURSE BY ID
    @Override
    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    // ADD LESSON TO COURSE
    @Override
    public Lesson addLesson(Long courseId, Lesson lesson) {
        Course course = getCourseById(courseId);
        lesson.setCourse(course);

        return lessonRepository.save(lesson);
    }

    //  GET LESSONS BY COURSE
    @Override
    public List<Lesson> getLessonsByCourse(Long courseId) {
        Course course = getCourseById(courseId);
        return lessonRepository.findByCourse(course);
    }

    // UPDATE LESSON
    @Override
    public Lesson updateLesson(Long lessonId, Lesson updatedLesson) {
        Lesson existingLesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // Update fields
        existingLesson.setTitle(updatedLesson.getTitle());
        existingLesson.setContent(updatedLesson.getContent());
        existingLesson.setMediaUrl(updatedLesson.getMediaUrl());
        existingLesson.setPosition(updatedLesson.getPosition());
        existingLesson.setDurationSeconds(updatedLesson.getDurationSeconds());

        return lessonRepository.save(existingLesson);
    }

    // DELETE LESSON
    @Override
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lessonRepository.delete(lesson);
    }

    @Override
    public Map<String, Object> getCourseWithStats(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("course", course);
        stats.put("enrollmentCount", course.getEnrollmentCount());
        stats.put("totalLessons", course.getLessons() != null ? course.getLessons().size() : 0);
        stats.put("totalRevenue", course.getPrice() * course.getEnrollmentCount());

        return stats;
    }
}