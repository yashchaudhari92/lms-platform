package com.lms.backend.service.impl;

import com.lms.backend.model.Course;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public Course updateCourse(Long id, Course updatedCourse) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setTitle(updatedCourse.getTitle());
        course.setDescription(updatedCourse.getDescription());
        course.setCoverImageUrl(updatedCourse.getCoverImageUrl());
        course.setApproved(updatedCourse.isApproved());

        Course savedCourse = courseRepository.save(course);
        System.out.println("Updated course - ID: " + savedCourse.getId() + ", Approved: " + savedCourse.isApproved());
        return savedCourse;
    }

    @Override
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }
}
