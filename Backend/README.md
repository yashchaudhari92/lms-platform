<h1>Learning Management System (LMS)</h1>
<p>The LMS isafull-featured web platform that facilitates online learning. It allows
Admins to manage users and system-wide content, Instructors to create and
manage courses, and Students to enroll in courses, consume content, take quizzes,
and track their learning progress. The system supports role-based access control,
secure login with JWT, and a dynamic, responsive frontend interface.</p>
<br>

<h1>What to do?</h1>
Authentication and Authorization
<p>Handles login and signup using JWT. Users can be Admins, Instructors, or Students.
Each role gets access only to specific parts of the system.</p>
<h1>Admin Module</h1>
<p>Admins can manage all users and courses. They can view, delete, or update user
roles and approve or remove courses created by instructors.</p>
<h1>Instructor Module</h1>
<p>Instructors can create and manage courses. They can add lessons to each course
and see which students have enrolled.</p>
<h1>Student Module</h1>
<p>Students can browse available courses,enroll in them, and view lessons. They can
also track their learning progress.</p>
<h1>Course and Lesson Management</h1>
<p>Courses include titles and descriptions. Each course has multiple lessons, which
can contain text, videos, or PDFs.</p>
<h1>Enrollment Module</h1>
<p>Students enroll in courses. Once enrolled, they get access to the course materials.
Duplicate enrollments are not allowed.</p>

<br>

## Media Upload Module
### The Media Upload Module allows instructors (or admins) to upload course-related
### files such as videos, PDFs, images, or audio. These media files are essential for
### creating rich lessons and enhancing the learning experience.
# Tech Stack:
<p>Frontend: React.js or Thymeleaf with Tailwind CSS
Backend: Spring Boot 3, Spring Security, JWT, Spring Data JPA
Database: MySQL/MongoDB
Testing: JUnit 5, Mockito
AWS $3/Uploadcare /Firebase Storage-for storing media like pdf, video, audio etc.
OpenAPI/Swagger - for endpoints documentation
Deployment: Render/Railway/Netlify
</p>
Testing:
Write JUnit 5 and Mockito unit tests for backend services.(Controller, Service,
Repository)
Perform end-to-end testing for user workflows.
How do I submit my work?
For Code Submission:
Code:
Push your complete project code to GitHub
<h1>• Organize your code into /backend and /frontend folders (if using React).</h1>
Deployment:
Option 1: Deploy Backend on Render/Railway/AWS EC2(Mandatory)
Option 2: Frontend on Vercel/Netlify(Mandatory)
Option 3: Record a 1-2 min walkthrough video and upload to Google Drive
(public access)(Optional)
