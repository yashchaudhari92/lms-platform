package com.lms.backend.util;

import com.lms.backend.dto.CourseDto;
import com.lms.backend.model.Course;
import com.lms.backend.model.User;
import com.lms.backend.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CourseMapper {

    public static Course toEntity(CourseDto dto, User instructor) {
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setCoverImageUrl(dto.getCoverImageUrl());
        course.setApproved(dto.isApproved());
        course.setInstructor(instructor);
        course.setLevel(dto.getLevel());
        course.setRating(dto.getRating());
        course.setTotalStudents(dto.getTotalStudents());
        course.setDuration(dto.getDuration());
        course.setPrice(dto.getPrice());

        return course;
    }

    public static CourseDto toDto(Course course) {
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setCoverImageUrl(course.getCoverImageUrl());
        dto.setApproved(course.isApproved());
        dto.setEnrollmentCount(course.getEnrollments() != null ? course.getEnrollments().size() : 0);

        // Instructor info
        if (course.getInstructor() != null) {
            dto.setInstructorId(course.getInstructor().getId());
            dto.setInstructorName(course.getInstructor().getUsername());
        }

        // Category info
        if (course.getCategory() != null) {
            dto.setCategoryId(course.getCategory().getId());
            dto.setCategoryName(course.getCategory().getName());
        }
        dto.setLevel(course.getLevel());
        dto.setRating(course.getRating());
        dto.setTotalStudents(course.getTotalStudents());
        dto.setDuration(course.getDuration());
        dto.setPrice(course.getPrice());

        return dto;
    }
}