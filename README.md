# 🎓 Learning Management System (LMS) Backend

[Watch Full Video 👆🏼](https://drive.google.com/file/d/1GTMQK1IE6Ck5ITKqIHvDme-4BKQMYZ-2/view?usp=drive_link)

https://github.com/user-attachments/assets/baa2f9f0-0512-4c1d-b25d-61c23470e59c



<!---
![LMS_Gif](https://github.com/user-attachments/assets/6b664c1f-1af7-4f79-a65b-67a2c1578a26)
--->







A full-featured **Learning Management System** built with **Spring Boot** that supports:
- Role-based access control
- Course & lesson management
- Secure authentication and authorization
- Student progress tracking
- Cloud-based media storage

---

## 🚀 Features



### 👥 Role-Based Access Control
| Role | Capabilities |
|------|--------------|
| **Admin** | Manage users • Approve courses • System oversight |
| **Instructor** | Create/manage courses • Manage lessons • View enrollments |
| **Student** | Browse courses • Enroll • Track learning progress |

---

### 📚 Course Management
- Create and manage courses with structured content
- Add lessons (Text, Video, PDF supported)
- Categorized courses with approval workflow
- Enrollment management with duplicate prevention

---

### 🔐 Security & Authentication
- JWT-based secure authentication
- Password hashing using **BCrypt**
- Role-based API access restrictions
- CORS enabled for frontend integration

---

### 📁 Media Handling
- AWS S3 cloud storage integration
- Supports Videos • PDFs • Images • Audio
- Secure upload & access endpoints

---

## 🛠 Tech Stack

### 🧩 Backend
| Component | Technology |
|----------|------------|
| Framework | **Spring Boot 3.5.6** |
| Security | **Spring Security 6.5.5 + JWT** |
| Database | **MySQL + Spring Data JPA** |
| API Docs | **Swagger / OpenAPI 3.1** |
| Testing | **JUnit 5, Mockito** |
| Build Tool | **Maven** |

### ☁️ Cloud Services
| Service | Provider |
|--------|----------|
| File Storage | **AWS S3** |
| Deployment | **Render / Railway (Backend)** <br> **Vercel / Netlify (Frontend)** |

---

## 📋 API Endpoints

### 🔑 Authentication Endpoints
| Method | Endpoint | Description | Access |
|-------|----------|-------------|--------|
| POST | `/api/auth/signup` | User Registration | Public |
| POST | `/api/auth/login` | Login & Token Issuance | Public |
| POST | `/api/auth/validate` | Validate JWT Token | All Roles |

---

### 🛡 Admin Endpoints
| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/{id}/role` | Update user role |
| GET | `/api/admin/courses` | Get all courses |
| PUT | `/api/admin/courses/{id}/approve` | Approve/Reject a course |
| DELETE | `/api/admin/courses/{id}` | Delete a course |

---

### 🎓 Instructor Endpoints
| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/api/instructor/courses` | Create new course |
| PUT | `/api/instructor/courses/{id}` | Update existing course |
| GET | `/api/instructor/courses` | View instructor’s courses |
| POST | `/api/instructor/courses/{courseId}/lessons` | Add lesson to course |
| GET | `/api/instructor/courses/{courseId}/enrollments` | View enrolled students |

---

### 🧑‍🎓 Student Endpoints
| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/api/student/courses` | Browse available courses |
| POST | `/api/student/courses/{courseId}/enroll` | Enroll in course |
| GET | `/api/student/enrollments` | View enrolled courses |
| GET | `/api/student/courses/{courseId}/lessons` | Access course lessons |
| PUT | `/api/student/progress/{lessonId}` | Update lesson progress |

---

### 🎥 Media Endpoints
| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/api/media/upload` | Upload media to AWS |
| GET | `/api/media/{filename}` | Retrieve media file |
| DELETE | `/api/media/{filename}` | Delete media file |

---


<details> <summary><strong>📁 lms.backend</strong></summary>
  
```
lms.backend/
├── .idea/
├── .mvn/
├── mvnw
├── mvnw.cmd
├── pom.xml
├── README.md
├── HELP.md
├── uploads/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── lms/
│   │   │           └── backend/
│   │   │               ├── LmsBackendApplication.java
│   │   │               ├── config/
│   │   │               │   ├── DataSeeder.java
│   │   │               │   └── S3Config.java
│   │   │               ├── controller/
│   │   │               │   ├── AdminController.java
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── CourseController.java
│   │   │               │   ├── InstructorController.java
│   │   │               │   ├── LessonController.java
│   │   │               │   ├── MediaController.java
│   │   │               │   └── StudentController.java
│   │   │               ├── dto/
│   │   │               │   ├── CourseDto.java
│   │   │               │   ├── LessonDto.java
│   │   │               │   ├── LoginRequest.java
│   │   │               │   └── SignupRequest.java
│   │   │               ├── exception/
│   │   │               │   ├── GlobalExceptionHandler.java
│   │   │               │   └── ResourceNotFoundException.java
│   │   │               ├── model/
│   │   │               │   ├── Category.java
│   │   │               │   ├── Course.java
│   │   │               │   ├── Enrollment.java
│   │   │               │   ├── Lesson.java
│   │   │               │   ├── LessonProgress.java
│   │   │               │   ├── Role.java
│   │   │               │   └── User.java
│   │   │               ├── repository/
│   │   │               │   ├── CategoryRepository.java
│   │   │               │   ├── CourseRepository.java
│   │   │               │   ├── EnrollmentRepository.java
│   │   │               │   ├── LessonProgressRepository.java
│   │   │               │   ├── LessonRepository.java
│   │   │               │   ├── RoleRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── security/
│   │   │               │   ├── CustomUserDetailsService.java
│   │   │               │   ├── JwtAuthenticationEntryPoint.java
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   ├── JwtTokenProvider.java
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── service/
│   │   │               │   ├── AdminService.java
│   │   │               │   ├── AuthService.java
│   │   │               │   ├── CourseService.java
│   │   │               │   ├── InstructorService.java
│   │   │               │   ├── LessonService.java
│   │   │               │   ├── MediaStorageService.java
│   │   │               │   ├── StudentService.java
│   │   │               │   └── UserService.java
│   │   │               └── service/impl/
│   │   │                   ├── AdminServiceImpl.java
│   │   │                   ├── AuthServiceImpl.java
│   │   │                   ├── CourseServiceImpl.java
│   │   │                   ├── InstructorServiceImpl.java
│   │   │                   ├── LessonServiceImpl.java
│   │   │                   ├── StudentServiceImpl.java
│   │   │                   └── UserServiceImpl.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/
│           └── com/
│               └── lms/
│                   └── backend/
│                       └── LmsBackendApplicationTests.java
└── target/

```
</details>

<details> <summary><strong>📁 lms.frontend</strong></summary>
  
```
lms.frontend/

├── node_modules/
├── public/
├── src/
│ ├── assets/
│ │ └── logo.png
│ │
│ ├── components/
│ │ ├── CourseCard.jsx
│ │ ├── Footer.jsx
│ │ ├── Loader.jsx
│ │ ├── Navbar.jsx
│ │ └── PrivateRoute.jsx
│ │
│ ├── context/
│ │ └── AuthContext.jsx
│ │
│ ├── hooks/
│ │ └── useAuth.js
│ │
│ ├── layouts/
│ │ ├── AdminLayout.jsx
│ │ ├── InstructorLayout.jsx
│ │ └── StudentLayout.jsx
│ │
│ ├── pages/
│ │ ├── admin/
│ │ │ ├── CourseApproval.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ └── UserManagement.jsx
│ │ │
│ │ ├── auth/
│ │ │ ├── Login.jsx
│ │ │ └── Signup.jsx
│ │ │
│ │ ├── instructor/
│ │ │ ├── AddLesson.jsx
│ │ │ ├── CourseDetail.jsx
│ │ │ ├── CreateCourse.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── EnrolledStudents.jsx
│ │ │ └── MediaUpload.jsx
│ │ │ └── MyCourses.jsx
│ │ │
│ │ └── student/
│ │ ├── CourseCatalog.jsx
│ │ ├── CourseViewer.jsx
│ │ ├── Dashboard.jsx
│ │ ├── MyLearning.jsx
│ │ ├── StudentLessonView.jsx
│ ├── Home.jsx
│ │
│ ├── routes/
│ │ └── AppRoutes.jsx
│ │
│ ├── services/
│ │ ├── adminService.js
│ │ ├── apiClient.js
│ │ ├── authService.js
│ │ ├── courseService.js
│ │ ├── instructorService.js
│ │ ├── lessonService.js
│ │ ├── StudentService.js
│ │ └── userService.js
│ │
│ ├── styles/
│ │ ├── globals.css
│ │ └── tailwind.css
│ │
│ ├── App.css
│ ├── App.jsx
│ ├── index.css
│ ├── main.jsx
│ └── NotFound.jsx
│
└── package.json
```
</details>

---

##  Testing

###  Unit Test Coverage
| Test Class | Focus Area |
|-----------|------------|
| **AuthServiceTest** | User registration & authentication flows |
| **CourseServiceTest** | Course CRUD operations & student enrollment logic |
| **UserServiceTest** | User management + role assignment operations |


###  Run Tests

```bash
./mvnw test
```

##  Database Schema

###  Key Entities Overview

| **Entity**        | **Important Fields** |
|------------------|----------------------|
| **Users**         | id, username, email, password, role_id |
| **Roles**         | id, name (`ROLE_ADMIN`, `ROLE_INSTRUCTOR`, `ROLE_STUDENT`) |
| **Courses**       | id, title, description, instructor_id, approved |
| **Lessons**       | id, title, content, course_id, media_url |
| **Enrollments**   | id, student_id, course_id, enrolled_at |
| **LessonProgress** | id, enrollment_id, lesson_id, completed |


### Installation & Setup

## Prerequisites
- Java 21
- MySQL 8.0+
- Maven 3.6+

## Local Development Setup
### 1) Clone Repository
```
git clone <your-repo-url>
cd lms.backend
```
### 2) Create Database in MySQL
```
CREATE DATABASE lms_db;
```
### 3) Update application.properties
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lms_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 4) Run the Application
```
./mvnw spring-boot:run
```
### 5) Access the Application & API Docs

| **Service** | **URL** |
|------------|---------|
| **Application** | http://localhost:8080 |
| **Swagger UI** | http://localhost:8080/swagger-ui/index.html |
| **OpenAPI JSON Spec** | http://localhost:8080/v3/api-docs |

## Deployment
### Backend (Render / Railway)

- Connect GitHub repository
- Set environment variables
- Deploy & auto-build

### Frontend (Netlify / Vercel)
- Deploy frontend build
- Set correct API Base URL

### Required Environment Variables
```properties
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```
## 📚 API Documentation

| **Resource**   | **URL** |
|----------------|---------|
| **Swagger UI** | `/swagger-ui/index.html` |
| **OpenAPI Spec** | `/v3/api-docs` |

## 👥 Default Users (Auto-Created on First Run)

| **Role**      | **Email**                     | **Password**     |
|---------------|-------------------------------|------------------|
| **Admin**     | admin@lms.com                 | admin123         |
| **Instructor**| instructor@lms.com            | instructor123    |
| **Student**   | student@lms.com               | student123       |

## Configuration Example
```
# Server
server.port=8080

# Database
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# AWS S3
aws.s3.bucket-name=your-bucket
aws.region=us-east-1
```


## Author
- Rachit Sharma
- GitHub: @rachitsharam300


