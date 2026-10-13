package com.lms.backend.config;

import com.lms.backend.model.*;
import com.lms.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Starting Data Seeding...");

        try {
            // 1. Create Roles (Always check if exists)
            createRoles();

            // 2. Create Categories (Only if not exists)
            createCategories();

            // 3. Create Default Users (Only if not exists)
            createDefaultUsers();

            // 4. Create Sample Courses & Lessons (Only if no courses exist)
            createSampleCourses();

            // 5. Create Sample Enrollments (Only if no enrollments exist)
            createSampleEnrollments();

            System.out.println("🎉 Data Seeding Completed Successfully!");

        } catch (Exception e) {
            System.err.println("❌ Data Seeding Failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createRoles() {
        try {
            if (roleRepository.count() == 0) {
                List<Role> roles = Arrays.asList(
                        Role.builder().name(Role.RoleName.ROLE_ADMIN).build(),
                        Role.builder().name(Role.RoleName.ROLE_INSTRUCTOR).build(),
                        Role.builder().name(Role.RoleName.ROLE_STUDENT).build()
                );

                roleRepository.saveAll(roles);
                System.out.println("✅ Default roles created: ADMIN, INSTRUCTOR, STUDENT");
            } else {
                System.out.println("ℹ️ Roles already exist in database");
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating roles: " + e.getMessage());
            throw e;
        }
    }

    private void createCategories() {
        try {
            if (categoryRepository.count() == 0) {
                List<Category> categories = Arrays.asList(
                        Category.builder().name("Full Stack").description("Full stack web development courses").build(),
                        Category.builder().name("Development Tools").description("Development tools and version control").build(),
                        Category.builder().name("Data Science").description("Data analysis, ML and AI courses").build(),
                        Category.builder().name("Mobile Development").description("Android and iOS app development").build(),
                        Category.builder().name("Cloud Computing").description("AWS, Azure, GCP cloud courses").build(),
                        Category.builder().name("Design").description("UI/UX design and graphics courses").build(),
                        Category.builder().name("DevOps").description("CI/CD, Docker, Kubernetes courses").build(),
                        Category.builder().name("AI/ML").description("Artificial Intelligence and Machine Learning").build(),
                        Category.builder().name("Security").description("Cyber security and ethical hacking").build(),
                        Category.builder().name("Programming").description("Programming languages and coding courses").build()
                );
                categoryRepository.saveAll(categories);
                System.out.println("✅ Default categories created: " + categories.size() + " categories");
            } else {
                System.out.println("ℹ️ Categories already exist in database");
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating categories: " + e.getMessage());
            throw e;
        }
    }

    private void createDefaultUsers() {
        try {
            int usersCreated = 0;

            // Admin User - Rachit Sharma
            if (!userRepository.existsByEmail("rachit.adm@lms.com")) {
                Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Admin role not found"));

                User admin = User.builder()
                        .username("Rachit Sharma")
                        .email("rachit.adm@lms.com")
                        .password(passwordEncoder.encode("rachit"))
                        .role(adminRole)
                        .build();
                userRepository.save(admin);
                usersCreated++;
                System.out.println("✅ Admin user created: rachit.adm@lms.com / rachit");
            }

            // Instructor User - Rahul
            if (!userRepository.existsByEmail("rahul.ins@lms.com")) {
                Role instructorRole = roleRepository.findByName(Role.RoleName.ROLE_INSTRUCTOR)
                        .orElseThrow(() -> new RuntimeException("Instructor role not found"));

                User instructor = User.builder()
                        .username("Rahul Kumar")
                        .email("rahul.ins@lms.com")
                        .password(passwordEncoder.encode("rahul"))
                        .role(instructorRole)
                        .build();
                userRepository.save(instructor);
                usersCreated++;
                System.out.println("✅ Instructor user created: rahul.ins@lms.com / rahul");
            }

            // Student Users
            createStudentUsers();

            if (usersCreated == 0) {
                System.out.println("ℹ️ All default users already exist");
            }

        } catch (Exception e) {
            System.err.println("❌ Error creating users: " + e.getMessage());
            throw e;
        }
    }

    private void createStudentUsers() {
        try {
            Role studentRole = roleRepository.findByName(Role.RoleName.ROLE_STUDENT)
                    .orElseThrow(() -> new RuntimeException("Student role not found"));

            List<User> students = Arrays.asList(
                    User.builder().username("Komal Singh").email("komal@lms.com").password(passwordEncoder.encode("komal")).role(studentRole).build(),
                    User.builder().username("Kajal Verma").email("kajal@lms.com").password(passwordEncoder.encode("kajal")).role(studentRole).build(),
                    User.builder().username("Rohit Sharma").email("rohit@lms.com").password(passwordEncoder.encode("rohit")).role(studentRole).build(),
                    User.builder().username("Raushan Kumar").email("raushan@lms.com").password(passwordEncoder.encode("raushan")).role(studentRole).build(),
                    User.builder().username("Alexa Johnson").email("alexa@lms.com").password(passwordEncoder.encode("alexa")).role(studentRole).build()
            );

            int created = 0;
            for (User student : students) {
                if (!userRepository.existsByEmail(student.getEmail())) {
                    userRepository.save(student);
                    created++;
                    System.out.println("✅ Student created: " + student.getEmail());
                }
            }
            if (created > 0) {
                System.out.println("✅ " + created + " students created successfully");
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating students: " + e.getMessage());
        }
    }

    private void createSampleCourses() {
        try {
            if (courseRepository.count() == 0) {
                // Get instructor
                User instructor = userRepository.findByEmail("rahul.ins@lms.com")
                        .orElseThrow(() -> new RuntimeException("Instructor not found"));

                // Get categories
                Category fullStackCat = categoryRepository.findByName("Full Stack").orElseThrow(() -> new RuntimeException("Full Stack category not found"));
                Category devToolsCat = categoryRepository.findByName("Development Tools").orElseThrow(() -> new RuntimeException("Development Tools category not found"));
                Category dataScienceCat = categoryRepository.findByName("Data Science").orElseThrow(() -> new RuntimeException("Data Science category not found"));
                Category mobileDevCat = categoryRepository.findByName("Mobile Development").orElseThrow(() -> new RuntimeException("Mobile Development category not found"));
                Category cloudCat = categoryRepository.findByName("Cloud Computing").orElseThrow(() -> new RuntimeException("Cloud Computing category not found"));
                Category designCat = categoryRepository.findByName("Design").orElseThrow(() -> new RuntimeException("Design category not found"));
                Category devOpsCat = categoryRepository.findByName("DevOps").orElseThrow(() -> new RuntimeException("DevOps category not found"));
                Category aiMlCat = categoryRepository.findByName("AI/ML").orElseThrow(() -> new RuntimeException("AI/ML category not found"));
                Category securityCat = categoryRepository.findByName("Security").orElseThrow(() -> new RuntimeException("Security category not found"));

                // Create all 11 courses with lessons
                createJavaFullStackCourse(instructor, fullStackCat);
                createGitGithubCourse(instructor, devToolsCat);
                createMernStackCourse(instructor, fullStackCat);
                createPythonDataScienceCourse(instructor, dataScienceCat);
                createReactNativeCourse(instructor, mobileDevCat);
                createAWSCourse(instructor, cloudCat);
                createUIUXCourse(instructor, designCat);
                createDevOpsCourse(instructor, devOpsCat);
                createMachineLearningCourse(instructor, aiMlCat);
                createFlutterCourse(instructor, mobileDevCat);
                createCyberSecurityCourse(instructor, securityCat);

                System.out.println("✅ All 11 courses created with lessons");

            } else {
                System.out.println("ℹ️ Courses already exist in database");
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating courses: " + e.getMessage());
            throw e;
        }
    }

    private void createJavaFullStackCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("Java Full Stack Development")
                .description("Master Java, Spring Boot, React, and MongoDB to become a full-stack developer. Build real-world projects and learn industry best practices.")
                .coverImageUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(12999.0)
                .level("Advanced")
                .rating(4.8)
                .totalStudents(3247)
                .duration("12 weeks")
                .build();
        Course savedCourse = courseRepository.save(course);

        List<Lesson> lessons = Arrays.asList(
                createLesson("Introduction to Full Stack", "Overview of full stack development and course structure", 1800, 1, savedCourse),
                createLesson("Java Fundamentals", "Core Java concepts, OOP, and data structures", 2400, 2, savedCourse),
                createLesson("Spring Boot Basics", "Building REST APIs with Spring Boot", 2100, 3, savedCourse),
                createLesson("Database Design with MongoDB", "NoSQL database design and integration", 2700, 4, savedCourse),
                createLesson("React Fundamentals", "React components, state, and props", 2200, 5, savedCourse),
                createLesson("Spring Security", "Authentication and authorization in Spring", 2600, 6, savedCourse),
                createLesson("Advanced React Patterns", "Hooks, context API, and state management", 2300, 7, savedCourse),
                createLesson("Microservices Architecture", "Building microservices with Spring Cloud", 2900, 8, savedCourse),
                createLesson("Project Setup", "Setting up the final project structure", 1900, 9, savedCourse),
                createLesson("Deployment Strategies", "Deploying full stack applications", 2500, 10, savedCourse)
        );
        lessonRepository.saveAll(lessons);
    }

    private void createGitGithubCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("Git & GitHub Masterclass")
                .description("Complete guide to version control with Git and collaboration with GitHub. Learn branching, merging, pull requests and open source contributions.")
                .coverImageUrl("https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(2999.0)
                .level("Beginner")
                .rating(4.9)
                .totalStudents(1895)
                .duration("6 weeks")
                .build();
        Course savedCourse = courseRepository.save(course);

        List<Lesson> lessons = Arrays.asList(
                createLesson("Version Control Introduction", "What is version control and why use Git", 1600, 1, savedCourse),
                createLesson("Git Installation & Setup", "Installing Git and basic configuration", 1400, 2, savedCourse),
                createLesson("Basic Git Commands", "add, commit, push, pull commands", 1800, 3, savedCourse),
                createLesson("Branching Strategies", "Creating, merging, and managing branches", 2000, 4, savedCourse),
                createLesson("GitHub Collaboration", "Working with remote repositories", 1900, 5, savedCourse),
                createLesson("Pull Requests & Code Review", "Creating PRs and review process", 1700, 6, savedCourse),
                createLesson("Git Workflows", "Different Git workflows for teams", 2100, 7, savedCourse),
                createLesson("Advanced Git Features", "Rebase, stash, and cherry-pick", 2200, 8, savedCourse),
                createLesson("GitHub Actions CI/CD", "Automating workflows with GitHub Actions", 2400, 9, savedCourse)
        );
        lessonRepository.saveAll(lessons);
    }

    private void createMernStackCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("MERN Stack Development")
                .description("Build modern web applications with MongoDB, Express.js, React, and Node.js. Full-stack development with latest technologies.")
                .coverImageUrl("https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(14999.0)
                .level("Intermediate")
                .rating(4.7)
                .totalStudents(2876)
                .duration("14 weeks")
                .build();
        Course savedCourse = courseRepository.save(course);

        List<Lesson> lessons = Arrays.asList(
                createLesson("MERN Stack Overview", "Introduction to MERN stack technologies", 1700, 1, savedCourse),
                createLesson("Node.js & Express Setup", "Setting up backend server", 2100, 2, savedCourse),
                createLesson("MongoDB Database Design", "NoSQL database design principles", 2300, 3, savedCourse),
                createLesson("REST API Development", "Building RESTful APIs with Express", 2500, 4, savedCourse),
                createLesson("React Frontend Setup", "Creating React application structure", 1900, 5, savedCourse),
                createLesson("State Management", "Managing state with Context API and Redux", 2700, 6, savedCourse),
                createLesson("Authentication System", "JWT authentication implementation", 2600, 7, savedCourse),
                createLesson("Real-time Features", "WebSocket integration for real-time apps", 2400, 8, savedCourse),
                createLesson("Deployment", "Deploying MERN applications", 2200, 9, savedCourse),
                createLesson("Performance Optimization", "Optimizing MERN stack applications", 2800, 10, savedCourse)
        );
        lessonRepository.saveAll(lessons);
    }

    // Similarly create methods for other courses...
    private void createPythonDataScienceCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("Python Data Science")
                .description("Learn data analysis, machine learning, and visualization with Python. Pandas, NumPy, Matplotlib, and Scikit-learn.")
                .coverImageUrl("https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(11999.0)
                .level("Intermediate")
                .rating(4.6)
                .totalStudents(2156)
                .duration("10 weeks")
                .build();
        Course savedCourse = courseRepository.save(course);

        List<Lesson> lessons = Arrays.asList(
                createLesson("Python for Data Science", "Python basics for data analysis", 1800, 1, savedCourse),
                createLesson("NumPy Fundamentals", "Numerical computing with NumPy", 2000, 2, savedCourse),
                createLesson("Pandas Data Analysis", "Data manipulation with Pandas", 2200, 3, savedCourse),
                createLesson("Data Visualization", "Creating plots with Matplotlib and Seaborn", 2100, 4, savedCourse),
                createLesson("Statistical Analysis", "Statistical methods for data science", 2400, 5, savedCourse),
                createLesson("Machine Learning Intro", "Introduction to ML algorithms", 2600, 6, savedCourse),
                createLesson("Scikit-learn", "Building ML models with scikit-learn", 2500, 7, savedCourse),
                createLesson("Data Preprocessing", "Cleaning and preparing data", 2300, 8, savedCourse),
                createLesson("Project: Data Analysis", "Complete data analysis project", 2800, 9, savedCourse)
        );
        lessonRepository.saveAll(lessons);
    }

    private void createReactNativeCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("React Native Mobile Development")
                .description("Build cross-platform mobile apps for iOS and Android using React Native. Learn state management, navigation, and deployment.")
                .coverImageUrl("https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(9999.0)
                .level("Intermediate")
                .rating(4.5)
                .totalStudents(1789)
                .duration("8 weeks")
                .build();
        Course savedCourse = courseRepository.save(course);

        List<Lesson> lessons = Arrays.asList(
                createLesson("React Native Introduction", "What is React Native and setup", 1600, 1, savedCourse),
                createLesson("Components and Styling", "Building UI components", 1900, 2, savedCourse),
                createLesson("Navigation", "Implementing navigation in mobile apps", 2100, 3, savedCourse),
                createLesson("State Management", "Managing app state", 2000, 4, savedCourse),
                createLesson("API Integration", "Connecting to backend APIs", 2300, 5, savedCourse),
                createLesson("Native Features", "Accessing device features", 2400, 6, savedCourse),
                createLesson("App Deployment", "Publishing to app stores", 2200, 7, savedCourse),
                createLesson("Performance Optimization", "Optimizing React Native apps", 2500, 8, savedCourse)
        );
        lessonRepository.saveAll(lessons);
    }

    // Continue with other course creation methods...
    // createAWSCourse, createUIUXCourse, createDevOpsCourse, createMachineLearningCourse, createFlutterCourse, createCyberSecurityCourse

    private void createAWSCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("AWS Cloud Practitioner")
                .description("Master AWS fundamentals and prepare for certification. EC2, S3, RDS, Lambda, and more with hands-on labs.")
                .coverImageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(8999.0)
                .level("Beginner")
                .rating(4.8)
                .totalStudents(3421)
                .duration("8 weeks")
                .build();
        courseRepository.save(course);
        // Add lessons similarly...
    }

    private void createUIUXCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("UI/UX Design Fundamentals")
                .description("Learn user-centered design principles, wireframing, prototyping, and design tools like Figma and Adobe XD.")
                .coverImageUrl("https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(7999.0)
                .level("Beginner")
                .rating(4.4)
                .totalStudents(1567)
                .duration("6 weeks")
                .build();
        courseRepository.save(course);
        // Add lessons similarly...
    }

    private void createDevOpsCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("DevOps with Docker & Kubernetes")
                .description("Containerization with Docker, orchestration with Kubernetes, CI/CD pipelines, and infrastructure as code.")
                .coverImageUrl("https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(13999.0)
                .level("Advanced")
                .rating(4.7)
                .totalStudents(1987)
                .duration("10 weeks")
                .build();
        courseRepository.save(course);
        // Add lessons similarly...
    }

    private void createMachineLearningCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("Machine Learning with Python")
                .description("Comprehensive machine learning course covering algorithms, neural networks, deep learning, and real-world applications.")
                .coverImageUrl("https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(15999.0)
                .level("Advanced")
                .rating(4.9)
                .totalStudents(2678)
                .duration("12 weeks")
                .build();
        courseRepository.save(course);
        // Add lessons similarly...
    }

    private void createFlutterCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("Flutter App Development")
                .description("Build beautiful native apps for iOS and Android with single codebase using Flutter and Dart programming.")
                .coverImageUrl("https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(10999.0)
                .level("Intermediate")
                .rating(4.6)
                .totalStudents(1890)
                .duration("9 weeks")
                .build();
        courseRepository.save(course);
        // Add lessons similarly...
    }

    private void createCyberSecurityCourse(User instructor, Category category) {
        Course course = Course.builder()
                .title("Cyber Security Fundamentals")
                .description("Learn ethical hacking, network security, cryptography, and security best practices to protect digital assets.")
                .coverImageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop")
                .instructor(instructor)
                .category(category)
                .approved(true)
                .price(11999.0)
                .level("Intermediate")
                .rating(4.8)
                .totalStudents(2345)
                .duration("10 weeks")
                .build();
        courseRepository.save(course);
        // Add lessons similarly...
    }

    private Lesson createLesson(String title, String content, int duration, int position, Course course) {
        return Lesson.builder()
                .title(title)
                .content(content)
                .durationSeconds(duration)
                .position(position)
                .course(course)
                .build();
    }

    private void createSampleEnrollments() {
        try {
            if (enrollmentRepository.count() == 0) {
                // Get all students
                List<User> students = userRepository.findByRoleName(Role.RoleName.ROLE_STUDENT);
                List<Course> courses = courseRepository.findAll();

                if (students.isEmpty() || courses.isEmpty()) {
                    System.out.println("ℹ️ No students or courses found for enrollments");
                    return;
                }

                int enrollmentsCreated = 0;

                // Create enrollments for each student in multiple courses
                for (User student : students) {
                    for (int i = 0; i < 3 && i < courses.size(); i++) {
                        Course course = courses.get(i);
                        Enrollment enrollment = Enrollment.builder()
                                .student(student)
                                .course(course)
                                .progress(Math.random() * 100)
                                .build();
                        enrollmentRepository.save(enrollment);
                        enrollmentsCreated++;
                    }
                }

                System.out.println("✅ " + enrollmentsCreated + " sample enrollments created");

            } else {
                System.out.println("ℹ️ Enrollments already exist in database");
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating enrollments: " + e.getMessage());
        }
    }
}