package com.lms.backend.service.impl;

import com.lms.backend.model.Course;
import com.lms.backend.model.Lesson;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.repository.LessonRepository;
import com.lms.backend.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public List<Lesson> getLessonsByCourseId(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return lessonRepository.findByCourseOrderByPositionAsc(course);
    }

    @Override
    public Lesson getLessonById(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    @Override
    public Lesson createLesson(Long courseId, Lesson lesson) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        lesson.setCourse(course);
        return lessonRepository.save(lesson);
    }

    @Override
    public Lesson updateLesson(Long id, Lesson lessonDetails) {
        Lesson lesson = getLessonById(id);
        lesson.setTitle(lessonDetails.getTitle());
        lesson.setContent(lessonDetails.getContent());
        lesson.setMediaUrl(lessonDetails.getMediaUrl());
        lesson.setPosition(lessonDetails.getPosition());
        lesson.setDurationSeconds(lessonDetails.getDurationSeconds());
        return lessonRepository.save(lesson);
    }

    @Override
    public void deleteLesson(Long id) {
        Lesson lesson = getLessonById(id);
        lessonRepository.delete(lesson);
    }

    // ✅ NEW METHOD IMPLEMENTATION
    @Override
    public Lesson updateLessonMediaUrl(Long lessonId, String mediaUrl) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        lesson.setMediaUrl(mediaUrl);
        return lessonRepository.save(lesson);
    }
}