package com.lms.backend.controller;

import com.lms.backend.service.MediaStorageService;
import com.lms.backend.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class MediaController {

    @Autowired
    private MediaStorageService mediaStorageService;

    @Autowired
    private LessonService lessonService;

    //  UPLOAD MEDIA FILE
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("courseId") Long courseId,
            @RequestParam("lessonId") Long lessonId) {  // Lesson ID

        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }
            // Upload file to S3
            String fileUrl = mediaStorageService.uploadFile(file, courseId);

            // Update lesson's media_url in database
            lessonService.updateLessonMediaUrl(lessonId, fileUrl);

            Map<String, String> response = new HashMap<>();
            response.put("message", "File uploaded successfully");
            response.put("fileUrl", fileUrl);
            response.put("fileName", file.getOriginalFilename());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "File upload failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // ✅ DELETE MEDIA FILE
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteMedia(
            @RequestParam String fileUrl) {
        try {
            mediaStorageService.deleteFile(fileUrl);

            Map<String, String> response = new HashMap<>();
            response.put("message", "File deleted successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "File deletion failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}