package com.lms.backend.service;

import com.lms.backend.model.User;
import java.util.List;

public interface UserService {
    User getUserById(Long id);
    List<User> getAllUsers();
    User saveUser(User user);
    void deleteUser(Long id);
}