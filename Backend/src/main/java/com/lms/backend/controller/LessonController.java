package com.lms.backend.controller;

import com.lms.backend.dto.LessonDto;
import com.lms.backend.model.Lesson;
import com.lms.backend.service.LessonService;
import com.lms.backend.util.LessonMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    // GET LESSONS BY COURSE ID
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonDto>> getLessonsByCourse(@PathVariable Long courseId) {
        try {
            List<Lesson> lessons = lessonService.getLessonsByCourseId(courseId);
            List<LessonDto> lessonDtos = lessons.stream()
                    .map(LessonMapper::toDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(lessonDtos);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // GET LESSON BY ID
    @GetMapping("/{id}")
    public ResponseEntity<LessonDto> getLessonById(@PathVariable Long id) {
        try {
            Lesson lesson = lessonService.getLessonById(id);
            return ResponseEntity.ok(LessonMapper.toDto(lesson));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // CREATE NEW LESSON
    @PostMapping("/course/{courseId}")
    public ResponseEntity<LessonDto> createLesson(
            @PathVariable Long courseId,
            @RequestBody LessonDto lessonDto) {
        try {
            Lesson lesson = LessonMapper.toEntity(lessonDto);
            Lesson savedLesson = lessonService.createLesson(courseId, lesson);
            return ResponseEntity.ok(LessonMapper.toDto(savedLesson));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // UPDATE LESSON
    @PutMapping("/{id}")
    public ResponseEntity<LessonDto> updateLesson(
            @PathVariable Long id,
            @RequestBody LessonDto lessonDto) {
        try {
            Lesson lesson = LessonMapper.toEntity(lessonDto);
            Lesson updatedLesson = lessonService.updateLesson(id, lesson);
            return ResponseEntity.ok(LessonMapper.toDto(updatedLesson));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE LESSON
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLesson(@PathVariable Long id) {
        try {
            lessonService.deleteLesson(id);
            return ResponseEntity.ok("Lesson deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all lessons for a course
    @GetMapping("/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> getLessonsByCourseId(@PathVariable Long courseId) {
        try {
            List<Lesson> lessons = lessonService.getLessonsByCourseId(courseId);
            return ResponseEntity.ok(lessons);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}