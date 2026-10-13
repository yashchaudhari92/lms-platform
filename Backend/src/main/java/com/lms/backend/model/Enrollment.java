package com.lms.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "course_id"})
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // student linking ------ EAGER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @NotNull
    @JsonIgnoreProperties({"password", "courses", "enrollments"})
    private User student;

    // course linking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @NotNull
    @JsonIgnoreProperties({"lessons", "instructor"})
    private Course course;

    // when enrolled
    private LocalDateTime enrolledAt = LocalDateTime.now();

    // progress percent (0-100)
    private Double progress = 0.0;

//    @PrePersist
//    protected void prePersist() {
//        if (enrolledAt == null) {
//            enrolledAt = LocalDateTime.now();
//        }
//    }

}
