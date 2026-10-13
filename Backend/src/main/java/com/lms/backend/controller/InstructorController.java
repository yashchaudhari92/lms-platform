package com.lms.backend.controller;

import com.lms.backend.dto.CourseDto;
import com.lms.backend.dto.LessonDto;
import com.lms.backend.model.Course;
import com.lms.backend.model.Lesson;
import com.lms.backend.model.User;
import com.lms.backend.model.Category;
import com.lms.backend.repository.CategoryRepository;
import com.lms.backend.service.InstructorService;
import com.lms.backend.service.UserService;
import com.lms.backend.util.CourseMapper;
import com.lms.backend.util.LessonMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/instructor")
@CrossOrigin(origins = "*")
public class InstructorController {

    @Autowired
    private InstructorService instructorService;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryRepository categoryRepository;

    // COURSE APIs
    @PostMapping("/courses")
    public CourseDto createCourse(@RequestBody CourseDto courseDto) {
        User instructor = userService.getUserById(courseDto.getInstructorId());
        Category category = categoryRepository.findById(courseDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Course course = CourseMapper.toEntity(courseDto, instructor);
        course.setCategory(category);
        Course saved = instructorService.createCourse(course, instructor.getId());
        return CourseMapper.toDto(saved);
    }

    @GetMapping("/{instructorId}/courses")
    public List<CourseDto> getInstructorCourses(@PathVariable Long instructorId) {
        List<Course> courses = instructorService.getCoursesByInstructor(instructorId);
        return courses.stream().map(CourseMapper::toDto).collect(Collectors.toList());
    }

    @GetMapping("/courses/{courseId}/stats")
    public Map<String, Object> getCourseStats(@PathVariable Long courseId) {
        return instructorService.getCourseWithStats(courseId);
    }

    @DeleteMapping("/courses/{id}")
    public String deleteCourse(@PathVariable Long id) {
        instructorService.deleteCourse(id);
        return "Course deleted successfully";
    }

    @PutMapping("/courses/{id}")
    public CourseDto updateCourse(@PathVariable Long id, @RequestBody CourseDto courseDto) {
        User instructor = userService.getUserById(courseDto.getInstructorId());
        Category category = categoryRepository.findById(courseDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Course updatedCourse = CourseMapper.toEntity(courseDto, instructor);
        updatedCourse.setCategory(category);
        Course saved = instructorService.updateCourse(id, updatedCourse);
        return CourseMapper.toDto(saved);
    }

    @GetMapping("/courses/{courseId}")
    public CourseDto getCourseById(@PathVariable Long courseId) {
        Course course = instructorService.getCourseById(courseId);
        return CourseMapper.toDto(course);
    }

    // LESSON MANAGEMENT APIs
    @PostMapping("/courses/{courseId}/lessons")
    public LessonDto addLesson(@PathVariable Long courseId, @RequestBody LessonDto lessonDto) {
        Course course = instructorService.getCourseById(courseId);
        Lesson lesson = LessonMapper.toEntity(lessonDto, course); // ✅ Course pass kare
        Lesson saved = instructorService.addLesson(courseId, lesson);
        return LessonMapper.toDto(saved);
    }

    @GetMapping("/courses/{courseId}/lessons")
    public List<LessonDto> getCourseLessons(@PathVariable Long courseId) {
        List<Lesson> lessons = instructorService.getLessonsByCourse(courseId);
        return lessons.stream().map(LessonMapper::toDto).collect(Collectors.toList());
    }

    @PutMapping("/lessons/{lessonId}")
    public LessonDto updateLesson(@PathVariable Long lessonId, @RequestBody LessonDto lessonDto) {
        Lesson lesson = new Lesson();
        lesson.setTitle(lessonDto.getTitle());
        lesson.setContent(lessonDto.getContent());
        lesson.setMediaUrl(lessonDto.getMediaUrl());
        lesson.setPosition(lessonDto.getPosition());
        lesson.setDurationSeconds(lessonDto.getDurationSeconds());

        Lesson updated = instructorService.updateLesson(lessonId, lesson);
        return LessonMapper.toDto(updated);
    }

    @DeleteMapping("/lessons/{lessonId}")
    public String deleteLesson(@PathVariable Long lessonId) {
        instructorService.deleteLesson(lessonId);
        return "Lesson deleted successfully";
    }
}