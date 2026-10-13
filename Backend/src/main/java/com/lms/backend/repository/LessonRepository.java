package com.lms.backend.repository;

import com.lms.backend.model.Course;
import com.lms.backend.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseOrderByPositionAsc(Course course);
    Optional<Lesson> findByIdAndCourse(Long id, Course course);
    List<Lesson> findByCourse(Course course);
    long countByCourse(Course course);
    List<Lesson> findByCourseId(Long courseId);
}