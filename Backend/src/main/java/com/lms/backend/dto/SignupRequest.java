package com.lms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {

    private String username;
    private String email;
    private String password;
    private String role; // Ex: "ROLE_STUDENT", "ROLE_INSTRUCTOR", "ROLE_ADMIN"
}
