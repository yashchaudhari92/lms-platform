package com.lms.backend.util;

import com.lms.backend.dto.LessonDto;
import com.lms.backend.model.Lesson;
import com.lms.backend.model.Course;

public class LessonMapper {

    // Lesson Entity to DTO conversion
    public static LessonDto toDto(Lesson lesson) {
        if (lesson == null) {
            return null;
        }

        return LessonDto.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .content(lesson.getContent())
                .mediaUrl(lesson.getMediaUrl())
                .position(lesson.getPosition())
                .durationSeconds(lesson.getDurationSeconds())
                .courseId(lesson.getCourse() != null ? lesson.getCourse().getId() : null)
                .build();
    }

    // Lesson DTO to Entity conversion (WITH Course)
    public static Lesson toEntity(LessonDto lessonDto, Course course) {
        if (lessonDto == null) {
            return null;
        }

        return Lesson.builder()
                .id(lessonDto.getId())
                .title(lessonDto.getTitle())
                .content(lessonDto.getContent())
                .mediaUrl(lessonDto.getMediaUrl())
                .position(lessonDto.getPosition())
                .durationSeconds(lessonDto.getDurationSeconds())
                .course(course)
                .build();
    }

    // Lesson DTO to Entity conversion (WITHOUT Course - for update)
    public static Lesson toEntity(LessonDto lessonDto) {
        if (lessonDto == null) {
            return null;
        }

        return Lesson.builder()
                .id(lessonDto.getId())
                .title(lessonDto.getTitle())
                .content(lessonDto.getContent())
                .mediaUrl(lessonDto.getMediaUrl())
                .position(lessonDto.getPosition())
                .durationSeconds(lessonDto.getDurationSeconds())
                .build();
    }
}