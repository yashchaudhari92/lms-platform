package com.lms.backend.service;

import com.lms.backend.model.Lesson;
import java.util.List;

    // Lesson Interface related for all business logic methods
public interface LessonService {

    // Get lessons through Course id @param courseID, @return List of lessons objects
    List<Lesson> getLessonsByCourseId(Long courseId);

    /**
     * To Get specific lesson through Lesson ID
     * @param id - Lesson unique ID
     * @return Lesson object
     * @throws RuntimeException if Lesson no find
     */
    Lesson getLessonById(Long id);

    /**
     * Create new lesson for specific courses
     */
    Lesson createLesson(Long courseId, Lesson lesson);

     // To Update Existing lesson
    Lesson updateLesson(Long id, Lesson lessonDetails);

     // Lesson delete
    void deleteLesson(Long id);

    // Media URL update method
    Lesson updateLessonMediaUrl(Long lessonId, String mediaUrl);

}