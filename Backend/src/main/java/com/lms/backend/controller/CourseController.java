package com.lms.backend.controller;

import com.lms.backend.dto.CourseDto;
import com.lms.backend.model.Course;
import com.lms.backend.model.User;
import com.lms.backend.service.CourseService;
import com.lms.backend.service.UserService;
import com.lms.backend.util.CourseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<CourseDto> getAllCourses() {
        return courseService.getAllCourses()
                .stream()
                .map(CourseMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public CourseDto getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        return CourseMapper.toDto(course);
    }

    @PostMapping
    public CourseDto createCourse(@RequestBody CourseDto courseDto) {
        User instructor = userService.getUserById(courseDto.getInstructorId());
        Course course = CourseMapper.toEntity(courseDto, instructor);
        Course saved = courseService.createCourse(course);
        return CourseMapper.toDto(saved);
    }

    @PutMapping("/{id}")
    public CourseDto updateCourse(@PathVariable Long id, @RequestBody CourseDto courseDto) {
        User instructor = userService.getUserById(courseDto.getInstructorId());
        Course course = CourseMapper.toEntity(courseDto, instructor);
        Course updated = courseService.updateCourse(id, course);
        return CourseMapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return "Course deleted successfully.";
    }
}
