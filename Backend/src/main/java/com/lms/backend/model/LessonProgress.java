package com.lms.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_progress",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "lesson_id"})
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"password", "courses", "enrollments"})
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonIgnoreProperties({"course"})
    private Lesson lesson;

    private boolean completed = false;

    private LocalDateTime completedAt;

    private LocalDateTime lastAccessedAt;

    private Integer timeSpent; // in min

    @PrePersist
    protected void prePersist() {
        if (lastAccessedAt == null) {
            lastAccessedAt = LocalDateTime.now();
        }
    }
}