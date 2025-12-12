# 🎓 Student User Journey

A comprehensive guide to the student experience in the Learning Management System.

## Overview

Students are the primary learners in the LMS system. They enroll in courses, consume content, take assessments, and participate in discussions. This journey covers their complete experience from registration to course completion.

## Student Capabilities

- **Course Access**: View and access enrolled courses only
- **Content Consumption**: Access lectures, videos, documents, and other course materials
- **Progress Tracking**: Track completion of lectures and overall course progress
- **Assessment Participation**: Take quizzes and submit assignments
- **Communication**: Participate in course discussions and receive notifications
- **Profile Management**: Update personal information and preferences

---

## Phase 1: Onboarding & Authentication

### 1.1 Registration Process

**Goal**: Create a new student account

**Steps**:

1. **Navigate to Registration**
- Access the registration page
- Choose organization context

2. **Provide Information**
- **Required Fields**:
  - Email address (must be unique within organization)
  - Password (minimum security requirements)
  - First name
  - Last name
  - Organization ID
- **Optional Fields**:
  - Matriculation number
  - Profile information

3. **System Processing**
- Email uniqueness validation within organization
- Password hashing with bcrypt
- User account creation
- JWT token generation (access + refresh tokens)

4. **Registration Confirmation**
   - Account created successfully
   - Login credentials provided
   - Next steps guidance

**API Endpoint**: `POST https://genlmsapi-production.up.railway.app/api/auth/register`

**Request Body**:

```json
{
  "email": "student@university.edu",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "organizationId": "org123",
  "matricNumber": "STU001"
}
```

**Response**:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "student@university.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "matricNumber": "STU001",
    "organizationId": "org123",
    "organization": {
      "id": "org123",
      "name": "University of Technology",
      "slug": "university-tech"
    }
  }
}
```

### 1.2 First Login

**Goal**: Authenticate and access the system

**Steps**:

1. **Enter Credentials**
- Email address
- Password
- Organization context

2. **Authentication Process**
   - Credential validation
   - Password verification
   - User lookup within organization

3. **Session Establishment**
   - JWT access token issued (15-minute expiration)
   - Refresh token provided
   - User profile loaded

4. **Dashboard Access**
   - Welcome message
   - Course overview
   - Quick actions available

**API Endpoint**: `POST https://genlmsapi-production.up.railway.app/api/auth/login`

**Request Body**:

```json
{
  "email": "student@university.edu",
  "password": "securePassword123",
  "organizationId": "org123"
}
```

### 1.3 Profile Setup

**Goal**: Complete student profile and preferences

**Steps**:

1. **Profile Information**
   - Update personal details
   - Add matriculation number
   - Set profile picture (optional)

2. **Preferences Configuration**
   - Notification preferences
   - Learning preferences
   - Accessibility settings

3. **Account Verification**
   - Email verification (if required)
   - Profile completion status

**API Endpoint**: `PUT https://genlmsapi-production.up.railway.app/api/users/profile`

---

## Phase 2: Course Discovery & Enrollment

### 2.1 Browse Available Courses

**Goal**: Discover courses available for enrollment

**Steps**:

1. **Course Catalog Access**
   - View courses in organization
   - Filter by subject, instructor, or keywords
   - Sort by popularity, date, or rating

2. **Course Information Review**
   - Course title and code
   - Course summary and description
   - Instructor information
   - Course cover image
   - Prerequisites (if any)

3. **Course Details**
   - Module structure preview
   - Learning objectives
   - Assessment types
   - Estimated duration

**API Endpoint**: `GET https://genlmsapi-production.up.railway.app/api/courses`

**Response**:

```json
[
  {
    "id": "course123",
    "title": "Introduction to Computer Science",
    "code": "CS101",
    "summary": "Fundamental concepts of computer science",
    "coverUrl": "https://example.com/cs101-cover.jpg",
    "instructor": {
      "id": "instructor123",
      "firstName": "Dr. Jane",
      "lastName": "Smith"
    },
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### 2.2 Enrollment Process

**Goal**: Enroll in desired courses

**Process**:

1. **Enrollment Request**
   - Student requests enrollment (typically through admin)
   - Admin creates enrollment record
   - Enrollment status set to ACTIVE

2. **Enrollment Confirmation**
   - Enrollment successful notification
   - Course access granted
   - Course added to student dashboard

**Note**: Enrollment is typically managed by administrators through the admin interface.

**API Endpoint**: `POST https://genlmsapi-production.up.railway.app/api/admin/enrollments` (Admin only)

**Request Body**:

```json
{
  "userId": "student123",
  "courseId": "course123"
}
```

### 2.3 Course Access

**Goal**: Access enrolled courses and content

**Steps**:

1. **Course Dashboard**
   - View enrolled courses
   - Course progress overview
   - Recent activity

2. **Course Entry**
   - Click on course to enter
   - Course structure navigation
   - Content access

**API Endpoint**: `GET https://genlmsapi-production.up.railway.app/api/courses/:id`

---

## Phase 3: Learning Experience

### 3.1 Course Navigation

**Goal**: Navigate through course structure and content

**Steps**:

1. **Course Overview**
   - Course information and objectives
   - Instructor details
   - Course progress summary

2. **Module Navigation**
   - View course modules
   - Module completion status
   - Lecture list within modules

3. **Content Organization**
   - Hierarchical structure: Course → Module → Lecture → Content
   - Sequential learning path
   - Progress indicators

**API Endpoint**: `GET https://genlmsapi-production.up.railway.app/api/courses/:id/modules`

**Response**:

```json
[
  {
    "id": "module123",
    "title": "Programming Fundamentals",
    "index": 1,
    "lectures": [
      {
        "id": "lecture123",
        "title": "Introduction to Variables",
        "index": 1,
        "contents": [
          {
            "id": "content123",
            "kind": "VIDEO",
            "title": "Variables Explained",
            "mediaUrl": "https://example.com/video1.mp4"
          }
        ]
      }
    ]
  }
]
```

### 3.2 Lecture Consumption

**Goal**: Consume course content and track progress

**Steps**:

1. **Content Access**
   - Access different content types:
     - **TEXT**: Written content and instructions
     - **VIDEO**: Video lectures and demonstrations
     - **AUDIO**: Audio recordings and podcasts
     - **FILE**: Documents, PDFs, and resources
     - **LIVE**: Live streaming sessions

2. **Progress Tracking**
   - Mark lectures as complete
   - Automatic progress calculation
   - Real-time progress updates

3. **Content Interaction**
   - Play/pause video content
   - Download files
   - Take notes (if supported)

**API Endpoint**: `PUT https://genlmsapi-production.up.railway.app/api/progress/lectures/:lectureId`

**Request Body**:

```json
{
  "completed": true
}
```

### 3.3 Progress Monitoring

**Goal**: Track learning progress and completion

**Steps**:

1. **Individual Progress**
   - Lecture completion status
   - Module completion percentage
   - Course completion percentage

2. **Progress Dashboard**
   - Overall progress overview
   - Course-by-course progress
   - Achievement tracking

3. **Progress Updates**
   - Real-time progress synchronization
   - Progress notifications
   - Completion celebrations

**API Endpoint**: `GET https://genlmsapi-production.up.railway.app/api/progress/me`

**Response**:

```json
[
  {
    "courseId": "course123",
    "courseTitle": "Introduction to Computer Science",
    "totalLectures": 20,
    "completedLectures": 15,
    "progressPercentage": 75
  }
]
```

---

## Phase 4: Assessment & Interaction

### 4.1 Quiz Taking

**Goal**: Complete quizzes and assessments

**Steps**:

1. **Quiz Access**
   - View available quizzes in course
   - Quiz instructions and rules
   - Time limits and attempt restrictions

2. **Question Types**
   - **MCQ**: Multiple choice questions
   - **TRUE_FALSE**: True/false questions
   - **SHORT_ANSWER**: Text-based answers

3. **Quiz Completion**
   - Answer questions sequentially
   - Review answers before submission
   - Submit quiz for grading

4. **Results and Feedback**
   - Immediate scoring
   - Correct answers review
   - Performance feedback

**API Endpoint**: `POST https://genlmsapi-production.up.railway.app/api/quizzes/:id/attempts`

**Request Body**:

```json
{
  "answers": {
    "question1": "optionA",
    "question2": "true",
    "question3": "JavaScript is a programming language"
  }
}
```

**Response**:

```json
{
  "id": "attempt123",
  "score": 8,
  "totalPoints": 10,
  "submittedAt": "2024-01-20T14:30:00Z",
  "answers": {
    "question1": "optionA",
    "question2": "true",
    "question3": "JavaScript is a programming language"
  }
}
```

### 4.2 Assignment Submission

**Goal**: Submit assignments and receive feedback

**Steps**:

1. **Assignment Access**
   - View assignment details
   - Read instructions and requirements
   - Check due dates and submission guidelines

2. **Submission Preparation**
   - Complete assignment work
   - Prepare files or text responses
   - Review submission requirements

3. **Submission Process**
   - Upload files (if required)
   - Enter text responses
   - Submit assignment

4. **Feedback Reception**
   - Receive grades and feedback
   - Review instructor comments
   - Understand performance

**API Endpoint**: `POST https://genlmsapi-production.up.railway.app/api/assignments/:id/submissions`

**Request Body**:

```json
{
  "fileUrl": "https://example.com/assignment.pdf",
  "text": "This is my assignment submission with detailed analysis..."
}
```

### 4.3 Discussion Participation

**Goal**: Engage in course discussions and collaborate

**Steps**:

1. **Thread Access**
   - View course discussion threads
   - Read existing messages
   - Understand discussion topics

2. **Message Participation**
   - Post new messages
   - Reply to existing messages
   - Ask questions and share insights

3. **Real-time Interaction**
   - Receive instant message notifications
   - See typing indicators
   - Participate in live discussions

**WebSocket Connection**: Connect to `/messaging`

**Message Format**:

```json
{
  "threadId": "thread123",
  "body": "I have a question about the assignment requirements..."
}
```

---

## Phase 5: Communication & Notifications

### 5.1 Real-time Notifications

**Goal**: Stay informed about course updates and important information

**Notification Types**:

1. **Course Announcements**
   - Instructor announcements
   - Course updates
   - Important information

2. **Assignment Reminders**
   - Due date notifications
   - Submission reminders
   - Grade notifications

3. **Quiz Updates**
   - Quiz availability
   - Results notifications
   - Performance feedback

4. **Discussion Updates**
   - New messages in threads
   - Replies to student messages
   - Instructor responses

**WebSocket Connection**: Connect to `/notifications`

**Notification Format**:

```json
{
  "id": "notification123",
  "title": "New Assignment Posted",
  "body": "Assignment 3: Data Structures Analysis is now available",
  "data": {
    "courseId": "course123",
    "assignmentId": "assignment123"
  },
  "createdAt": "2024-01-20T10:00:00Z"
}
```

### 5.2 Messaging System

**Goal**: Communicate with instructors and peers

**Features**:

1. **Thread Management**
   - Join course discussion threads
   - Create new discussion topics
   - Manage thread subscriptions

2. **Message Features**
   - Send text messages
   - Receive instant delivery
   - View message history

3. **Real-time Features**
   - Live message updates
   - Typing indicators
   - Online presence

**API Endpoint**: `GET https://genlmsapi-production.up.railway.app/api/messaging/threads/:id/messages`

---

## Success Metrics & KPIs

### Learning Progress

- **Course Completion Rate**: Percentage of enrolled courses completed
- **Lecture Completion**: Average lecture completion per course
- **Time to Completion**: Average time to complete courses

### Engagement Metrics

- **Quiz Participation**: Percentage of quizzes attempted
- **Assignment Submission**: Timely assignment submission rate
- **Discussion Participation**: Messages posted per course

### Performance Indicators

- **Quiz Scores**: Average quiz performance
- **Assignment Grades**: Average assignment performance
- **Platform Usage**: Time spent on platform per session

---

## Common Student Scenarios

### Scenario 1: First-Time Student

1. Register for account
2. Complete profile setup
3. Browse available courses
4. Get enrolled by admin
5. Start first course
6. Complete initial lectures
7. Take first quiz
8. Submit first assignment

### Scenario 2: Returning Student

1. Login to system
2. Check course progress
3. Continue with lectures
4. Participate in discussions
5. Take scheduled quizzes
6. Submit assignments
7. Track overall progress

### Scenario 3: Course Completion

1. Complete final lectures
2. Take final assessments
3. Submit final assignments
4. Participate in course evaluation
5. Receive course completion certificate
6. Enroll in next course

---

## Troubleshooting Common Issues

### Login Problems

- **Issue**: Cannot login with credentials
- **Solution**: Verify email and organization ID, reset password if needed

### Course Access Issues

- **Issue**: Cannot access course content
- **Solution**: Check enrollment status, contact admin if not enrolled

### Progress Not Updating

- **Issue**: Progress not reflecting after lecture completion
- **Solution**: Refresh page, check internet connection, contact support

### Assignment Submission Problems

- **Issue**: Cannot submit assignment
- **Solution**: Check file size limits, verify due date, contact instructor

---

## Best Practices for Students

### Learning Efficiency

- Set regular study schedules
- Take notes during lectures
- Review content before assessments
- Participate actively in discussions

### Time Management

- Check due dates regularly
- Start assignments early
- Allocate time for each course
- Use progress tracking features

### Communication

- Ask questions in discussions
- Respond to instructor feedback
- Collaborate with peers
- Stay updated with notifications

---

_This student journey guide provides a comprehensive overview of the student experience in the LMS system, from initial registration through course completion and ongoing engagement._
