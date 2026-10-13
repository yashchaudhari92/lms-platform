package com.lms.backend.repository;

import com.lms.backend.model.Course;
import com.lms.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor(User instructor);
    List<Course> findByApprovedTrue();
    Optional<Course> findByIdAndInstructor(Long id, User instructor);

    List<Course> findByApprovedFalse();
    List<Course> findByApprovedTrueAndCategoryId(Long categoryId);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId")
    int countEnrollmentsByCourseId(@Param("courseId") Long courseId);
}