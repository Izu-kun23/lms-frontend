# 🗺️ LMS User Journey Map

A comprehensive guide to user experiences across all roles in the Learning Management System.

## Table of Contents

- [User Roles & Permissions Overview](#user-roles--permissions-overview)
- [Student User Journey](#student-user-journey)
- [Instructor User Journey](#instructor-user-journey)
- [Admin User Journey](#admin-user-journey)
- [Super Admin User Journey](#super-admin-user-journey)
- [Real-Time Features Journey](#real-time-features-journey)
- [Key Journey Metrics](#key-journey-metrics)

---

## User Roles & Permissions Overview

| Role            | Permissions                                                                                         | Access Level        |
| --------------- | --------------------------------------------------------------------------------------------------- | ------------------- |
| **STUDENT**     | View enrolled courses, track progress, take quizzes, submit assignments, participate in discussions | Organization-scoped |
| **INSTRUCTOR**  | Create/manage courses, grade assignments, moderate discussions, view student progress               | Organization-scoped |
| **ADMIN**       | Manage users, enrollments, system settings, view analytics                                          | Organization-scoped |
| **SUPER_ADMIN** | Cross-organization access, system-wide management                                                   | Global              |

---

## 🎓 Student User Journey

### Phase 1: Onboarding & Authentication

```
Registration → Email Verification → Login → Profile Setup
```

#### Step-by-Step Process:

1. **Registration**
   - **Input Required**: email, password, firstName, lastName, organizationId
   - **System Validation**: Unique email within organization
   - **Security**: Password hashed with bcrypt
   - **Authentication**: JWT tokens generated (access + refresh)
   - **API Endpoint**: `POST /api/v1/auth/register`

2. **First Login**
   - **Input Required**: email, password, organizationId
   - **Authentication**: Credential validation
   - **Response**: User profile with organization details
   - **Token Management**: Access token expires in 15 minutes
   - **API Endpoint**: `POST /api/v1/auth/login`

3. **Profile Completion**
   - **Optional Fields**: matricNumber, profile information
   - **Customization**: User preferences and settings
   - **API Endpoint**: `PUT /api/v1/users/profile`

### Phase 2: Course Discovery & Enrollment

```
Browse Available Courses → Request Enrollment → Admin Approval → Access Granted
```

#### Course Access Flow:

1. **View Available Courses**
   - **Access**: Courses in user's organization
   - **Information Displayed**: title, code, summary, instructor, coverUrl
   - **Enrollment Status**: Visual indicators for enrollment status
   - **API Endpoint**: `GET /api/v1/courses`

2. **Enrollment Process**
   - **Admin Action**: Admin creates enrollment via `POST /api/v1/admin/enrollments`
   - **Enrollment Status**: ACTIVE, DROPPED, COMPLETED
   - **Validation**: Unique constraint prevents duplicate enrollments
   - **Database**: Enrollment record created with userId, courseId, status

3. **Course Access**
   - **Access Control**: Students can only access enrolled courses
   - **Course Structure**: Organization → Course → Module → Lecture → Content
   - **Progress Tracking**: Real-time progress updates
   - **API Endpoint**: `GET /api/v1/courses/:id`

### Phase 3: Learning Experience

```
Access Course → Navigate Modules → Complete Lectures → Track Progress
```

#### Learning Flow:

1. **Course Navigation**
   - **Dashboard**: Access course overview and structure
   - **Module View**: Hierarchical content organization
   - **Progress Indicators**: Visual progress tracking
   - **API Endpoint**: `GET /api/v1/courses/:id/modules`

2. **Lecture Consumption**
   - **Content Types**: TEXT, VIDEO, AUDIO, FILE, LIVE
   - **Progress Marking**: Mark lectures as complete
   - **Real-time Updates**: Progress automatically tracked
   - **API Endpoint**: `PUT /api/v1/progress/lectures/:lectureId`

3. **Progress Tracking**
   - **Real-time Updates**: Instant progress synchronization
   - **Course Completion**: Percentage-based completion tracking
   - **Lecture Status**: Individual lecture completion status
   - **API Endpoint**: `GET /api/v1/progress/me`

### Phase 4: Assessment & Interaction

```
Take Quizzes → Submit Assignments → Participate in Discussions → Receive Feedback
```

#### Assessment Journey:

1. **Quiz Taking**
   - **Access**: Published quizzes in enrolled courses
   - **Question Types**: MCQ, TRUE_FALSE, SHORT_ANSWER
   - **Attempts**: Multiple attempts allowed
   - **Scoring**: Immediate feedback and scoring
   - **API Endpoint**: `POST /api/v1/quizzes/:id/attempts`

2. **Assignment Submission**
   - **Assignment Details**: Description, due dates, requirements
   - **Submission Types**: File uploads or text responses
   - **Feedback**: Receive grades and instructor feedback
   - **API Endpoint**: `POST /api/v1/assignments/:id/submissions`

3. **Discussion Participation**
   - **Course Threads**: Course-specific discussion threads
   - **Real-time Messaging**: WebSocket-based communication
   - **Features**: Typing indicators, message history
   - **API Endpoint**: WebSocket connection to `/messaging`

### Phase 5: Communication & Notifications

```
Receive Notifications → Participate in Discussions → Get Updates
```

#### Communication Features:

1. **Real-time Notifications**
   - **Types**: Course announcements, assignment reminders, quiz results
   - **Delivery**: WebSocket-based real-time delivery
   - **Persistence**: Notification history stored
   - **API Endpoint**: WebSocket connection to `/notifications`

2. **Messaging System**
   - **Threads**: Course-specific discussion threads
   - **Real-time**: Instant message delivery
   - **History**: Message persistence and retrieval
   - **API Endpoint**: `GET /api/v1/messaging/threads/:id/messages`

---

## 👨‍🏫 Instructor User Journey

### Phase 1: Course Creation & Setup

```
Create Course → Add Modules → Create Lectures → Upload Content
```

#### Course Creation Flow:

1. **Course Setup**
   - **Required Fields**: title, code, summary
   - **Optional Fields**: coverUrl
   - **Organization**: Automatically assigned to instructor's organization
   - **API Endpoint**: `POST /api/v1/courses`

2. **Content Structure**
   - **Modules**: Add modules with titles and ordering
   - **Lectures**: Create lectures within modules
   - **Content**: Upload various content types
   - **API Endpoints**:
     - `POST /api/v1/courses/:id/modules`
     - `POST /api/v1/modules/:id/lectures`
     - `POST /api/v1/lectures/:id/contents`

3. **Content Management**
   - **Organization**: Content ordered by index
   - **Metadata**: Additional information for media content
   - **Preview**: Content preview before publishing
   - **API Endpoint**: `PUT /api/v1/contents/:id`

### Phase 2: Student Management & Monitoring

```
View Enrolled Students → Monitor Progress → Track Engagement
```

#### Student Management:

1. **Enrollment Overview**
   - **Student List**: View all enrolled students
   - **Status Tracking**: Monitor enrollment status
   - **Activity Monitoring**: Track student engagement
   - **API Endpoint**: `GET /api/v1/courses/:id/enrollments`

2. **Progress Monitoring**
   - **Real-time Tracking**: Live progress updates
   - **Analytics**: Course completion statistics
   - **Individual Reports**: Per-student progress reports
   - **API Endpoint**: `GET /api/v1/progress/users/:userId`

### Phase 3: Assessment Creation & Grading

```
Create Quizzes → Design Assignments → Grade Submissions → Provide Feedback
```

#### Assessment Management:

1. **Quiz Creation**
   - **Question Design**: MCQ, TRUE_FALSE, SHORT_ANSWER
   - **Answer Configuration**: Correct answers and point values
   - **Settings**: Quiz configuration and publishing
   - **API Endpoint**: `POST /api/v1/quizzes`

2. **Assignment Management**
   - **Assignment Creation**: Descriptions and requirements
   - **Due Dates**: Time-based assignment management
   - **Grading**: Submission review and feedback
   - **API Endpoint**: `POST /api/v1/assignments`

3. **Grading System**
   - **Submission Review**: Student submission evaluation
   - **Grade Assignment**: Numerical and feedback grading
   - **Progress Tracking**: Grading completion status
   - **API Endpoint**: `PUT /api/v1/assignments/:id/submissions/:submissionId`

### Phase 4: Communication & Engagement

```
Moderate Discussions → Send Announcements → Provide Support
```

#### Communication Features:

1. **Discussion Moderation**
   - **Thread Monitoring**: Course discussion oversight
   - **Interaction Management**: Student interaction moderation
   - **Academic Participation**: Instructor engagement in discussions
   - **API Endpoint**: WebSocket connection to `/messaging`

2. **Announcements**
   - **Course-wide Notifications**: Broadcast to all enrolled students
   - **Updates**: Course change notifications
   - **Information Sharing**: Important course information
   - **API Endpoint**: `POST /api/v1/notifications`

---

## 👨‍💼 Admin User Journey

### Phase 1: User Management

```
Create Users → Manage Roles → Handle Enrollments → Monitor Activity
```

#### User Administration:

1. **User Creation**
   - **Account Setup**: Create new user accounts
   - **Role Assignment**: Assign appropriate roles (STUDENT, INSTRUCTOR, ADMIN)
   - **Organization Context**: Set organization membership
   - **API Endpoint**: `POST /api/v1/admin/users`

2. **Role Management**
   - **Role Updates**: Modify user roles
   - **Permission Management**: Control access permissions
   - **Role Transitions**: Handle role changes
   - **API Endpoint**: `PUT /api/v1/admin/users/:id/role`

3. **Enrollment Management**
   - **Enrollment Creation**: Create course enrollments
   - **Status Management**: Manage enrollment status
   - **Request Handling**: Process enrollment requests
   - **API Endpoint**: `POST /api/v1/admin/enrollments`

### Phase 2: Course & Content Oversight

```
Monitor Courses → Manage Instructors → Oversee Content Quality
```

#### Course Administration:

1. **Course Oversight**
   - **Course View**: All courses in organization
   - **Quality Monitoring**: Course content quality assessment
   - **Availability Management**: Course access control
   - **API Endpoint**: `GET /api/v1/courses`

2. **Instructor Management**
   - **Instructor Assignment**: Assign instructors to courses
   - **Performance Monitoring**: Track instructor effectiveness
   - **Support Provision**: Provide instructor assistance
   - **API Endpoint**: `GET /api/v1/users?role=INSTRUCTOR`

### Phase 3: Analytics & Reporting

```
View System Statistics → Generate Reports → Monitor Performance
```

#### Analytics Features:

1. **User Statistics**
   - **Active Users**: Current user activity counts
   - **Engagement Metrics**: User interaction levels
   - **Activity Tracking**: Last activity timestamps
   - **API Endpoint**: `GET /api/v1/admin/stats/users`

2. **Course Analytics**
   - **Enrollment Statistics**: Course enrollment data
   - **Completion Rates**: Course completion metrics
   - **Performance Metrics**: Student performance data
   - **API Endpoint**: `GET /api/v1/admin/stats/courses`

3. **System Monitoring**
   - **Usage Statistics**: Platform utilization data
   - **Performance Metrics**: System performance indicators
   - **Health Monitoring**: System health status
   - **API Endpoint**: `GET /api/v1/health`

---

## 🔧 Super Admin User Journey

### Phase 1: System-Wide Management

```
Manage Organizations → Oversee All Users → Monitor System Health
```

#### Global Administration:

1. **Organization Management**
   - **Organization Creation**: Create and configure organizations
   - **Settings Management**: Organization-level configuration
   - **Issue Resolution**: Handle organization-level problems
   - **API Endpoint**: `POST /api/v1/organizations`

2. **Cross-Organization Access**
   - **Data Access**: Access any organization's data
   - **User Management**: Manage users across organizations
   - **System Issues**: Handle system-wide problems
   - **API Endpoint**: Global access to all endpoints

### Phase 2: System Configuration

```
Configure Global Settings → Manage System Resources → Handle Maintenance
```

#### System Configuration:

1. **Global Settings**
   - **System Parameters**: Configure system-wide settings
   - **Feature Flags**: Manage feature availability
   - **Security Policies**: Set security configurations
   - **Configuration**: Environment variable management

2. **Resource Management**
   - **Resource Monitoring**: Track system resource usage
   - **Scaling Management**: Handle scaling requirements
   - **Database Operations**: Manage database operations
   - **Monitoring**: System performance monitoring

---

## 🔄 Real-Time Features Journey

### WebSocket Connection Flow

```
Establish Connection → Authenticate → Join Rooms → Receive Updates
```

#### Real-Time Experience:

1. **Connection Setup**
   - **Authentication**: JWT authentication via WebSocket
   - **User Identification**: User validation and identification
   - **Room Organization**: Room-based user organization
   - **Connection Endpoint**: WebSocket connection to `/messaging`

2. **Live Features**
   - **Real-time Messaging**: Instant messaging in course threads
   - **Instant Notifications**: Real-time notification delivery
   - **Typing Indicators**: Live typing status indicators
   - **Progress Updates**: Real-time progress synchronization

3. **Event Broadcasting**
   - **Course Announcements**: Real-time course updates
   - **Assignment Notifications**: Instant assignment alerts
   - **Quiz Results**: Immediate quiz result delivery
   - **System Updates**: Real-time system notifications

---

## 📊 Key Journey Metrics

### Student Success Indicators

- **Course Completion Rates**: Percentage of courses completed
- **Assignment Submission Rates**: Timely assignment submission
- **Quiz Performance Scores**: Average quiz performance
- **Discussion Participation**: Engagement in course discussions
- **Platform Usage**: Time spent on platform

### Instructor Effectiveness

- **Course Creation**: Number of courses created and managed
- **Student Engagement**: Student interaction levels
- **Grading Efficiency**: Speed and quality of grading
- **Communication Frequency**: Regular communication with students

### System Performance

- **User Activity Levels**: Daily/monthly active users
- **Feature Utilization**: Usage of different platform features
- **Error Rates**: System error frequency and types
- **Response Times**: API and WebSocket response performance

---

## 🔐 Security & Access Control

### Authentication Flow

1. **JWT Token Management**
   - Access tokens (15-minute expiration)
   - Refresh tokens (longer expiration)
   - Token refresh mechanism

2. **Role-Based Access Control**
   - Role validation on protected routes
   - Organization-scoped access control
   - Permission-based feature access

3. **Multi-Tenant Security**
   - Organization data isolation
   - Cross-organization access prevention
   - Super admin override capabilities

### Data Protection

- **Password Security**: bcrypt hashing
- **Input Validation**: DTO validation with class-validator
- **SQL Injection Protection**: Prisma ORM protection
- **CORS Configuration**: Controlled cross-origin access
- **Rate Limiting**: 100 requests per minute per user

---

## 🚀 API Endpoints Summary

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `POST /api/v1/auth/logout` - User logout

### Courses

- `GET /api/v1/courses` - List courses
- `POST /api/v1/courses` - Create course (Instructor/Admin)
- `GET /api/v1/courses/:id` - Get course details
- `PUT /api/v1/courses/:id` - Update course

### Progress

- `GET /api/v1/progress/me` - Get user progress
- `PUT /api/v1/progress/lectures/:id` - Update lecture progress
- `GET /api/v1/progress/users/:id` - Get user progress (Admin/Instructor)

### Messaging

- WebSocket connection for real-time messaging
- `GET /api/v1/messaging/threads` - List threads
- `POST /api/v1/messaging/threads` - Create thread
- `GET /api/v1/messaging/threads/:id/messages` - Get messages

### Admin

- `POST /api/v1/admin/users` - Create user
- `POST /api/v1/admin/enrollments` - Create enrollment
- `GET /api/v1/admin/stats/users` - User statistics
- `GET /api/v1/admin/stats/courses` - Course statistics

---

_This user journey map provides a comprehensive overview of how different user types interact with the LMS system, from initial registration through advanced features and administration._
