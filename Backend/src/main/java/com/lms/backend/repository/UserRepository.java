package com.lms.backend.repository;

import com.lms.backend.model.Role;
import com.lms.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
    // UserRepository.java mein
    long countByRoleName(Role.RoleName roleName);
    List<User> findByRoleName(Role.RoleName roleName);

}