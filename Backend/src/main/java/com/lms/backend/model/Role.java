package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false, unique = true)
    private RoleName name;

    // Enum defining all possible roles
    public enum RoleName {
        ROLE_ADMIN,
        ROLE_INSTRUCTOR,
        ROLE_STUDENT
    }
}
