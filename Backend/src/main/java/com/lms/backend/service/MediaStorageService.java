
package com.lms.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class MediaStorageService {

    private final Path storageRoot =
            Paths.get("uploads").toAbsolutePath().normalize();

    public String uploadFile(MultipartFile file, Long courseId) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }

        try {
            String originalName = file.getOriginalFilename();
            String safeName = originalName == null
                    ? "file"
                    : Paths.get(originalName.replace('\\', '/'))
                      .getFileName().toString()
                      .replaceAll("[^a-zA-Z0-9._-]", "_");

            if (safeName.isBlank() || safeName.equals(".")
                    || safeName.equals("..")) {
                safeName = "file";
            }

            String folderName = "course_" + courseId;
            String storedName = UUID.randomUUID() + "_" + safeName;

            Path courseDirectory = storageRoot.resolve(folderName).normalize();
            if (!courseDirectory.startsWith(storageRoot)) {
                throw new IllegalArgumentException("Invalid course path");
            }

            Files.createDirectories(courseDirectory);

            Path destination = courseDirectory.resolve(storedName).normalize();
            if (!destination.startsWith(courseDirectory)) {
                throw new IllegalArgumentException("Invalid file path");
            }

            file.transferTo(destination);

            // Store a URL that the frontend can request from this backend.
            return "/uploads/" + folderName + "/" + storedName;

        } catch (IOException ex) {
            throw new RuntimeException(
                    "Local file upload failed: " + ex.getMessage(), ex);
        }
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            throw new IllegalArgumentException("File URL must not be empty");
        }

        try {
            String path = URI.create(fileUrl).getPath();

            if (path == null || !path.startsWith("/uploads/")) {
                throw new IllegalArgumentException("Invalid local media URL");
            }

            Path filePath = storageRoot.resolve(path.substring("/uploads/".length()))
                    .normalize();

            if (!filePath.startsWith(storageRoot)) {
                throw new IllegalArgumentException("Invalid file path");
            }

            Files.deleteIfExists(filePath);

        } catch (IOException ex) {
            throw new RuntimeException(
                    "Local file deletion failed: " + ex.getMessage(), ex);
        }
    }
}
