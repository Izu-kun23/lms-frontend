# Student & Instructor Dashboard Component Documentation

## Table of Contents

1. [Visual Design & Layout](#1-visual-design--layout)
2. [Color Scheme](#2-color-scheme)
3. [Reusable Components](#3-reusable-components)
4. [Component Usage Examples](#4-component-usage-examples)
5. [Complete API Reference](#5-complete-api-reference)

---

## 1. Visual Design & Layout

### 1.1 Student Dashboard Layout

**Route**: `/student/dashboard`  
**Component**: `src/app/(protected)/student/dashboard/page.tsx`

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Fixed)                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Welcome Message | Search Bar | Notifications         │ │
│  └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Stat Cards Row (3 cards)                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Enrolled │  │ Progress │  │ Assign.  │                 │
│  │ Courses  │  │ Overall  │  │ Pending  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
├─────────────────────────────────────────────────────────────┤
│  Main Content Area (2 columns on desktop)                   │
│  ┌──────────────────────┐  ┌──────────────────────┐      │
│  │  My Courses Grid      │  │  Recent Activity     │      │
│  │  (Course Cards)       │  │  Feed                │      │
│  │                       │  │                      │      │
│  └──────────────────────┘  └──────────────────────┘      │
│  ┌──────────────────────┐  ┌──────────────────────┐      │
│  │  Study Hours Chart    │  │  Upcoming            │      │
│  │  (Bar Chart)          │  │  Assignments/Quizzes  │      │
│  └──────────────────────┘  └──────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

#### Component Hierarchy

```
StudentDashboardPage
├── StudentDashboardHeader
│   ├── WelcomeMessage
│   ├── SearchBar
│   └── NotificationBell
├── StudentStatCards
│   ├── EnrolledCoursesCard
│   ├── OverallProgressCard
│   └── PendingAssignmentsCard
├── MainContentGrid
│   ├── MyCoursesSection
│   │   └── CourseCard[] (grid)
│   ├── RecentActivityFeed
│   │   └── ActivityItem[]
│   ├── StudyHoursChart
│   │   └── HoursChart (BarChart)
│   └── UpcomingSection
│       ├── UpcomingAssignments[]
│       └── UpcomingQuizzes[]
└── StudentSidebar (optional, collapsible)
    ├── QuickActions
    ├── ProgressSummary
    └── Notifications
```

#### Responsive Breakpoints

- **Mobile (< 768px)**: Single column, stacked cards
- **Tablet (768px - 1024px)**: 2 columns for stat cards, single column for main content
- **Desktop (≥ 1024px)**: Full layout with sidebar option
- **Large Desktop (≥ 1280px)**: Optimized spacing and larger cards

### 1.2 Instructor Dashboard Layout

**Route**: `/instructor/dashboard`  
**Component**: `src/app/(protected)/instructor/dashboard/page.tsx`

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Fixed)                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Welcome Message | Quick Actions | Notifications      │ │
│  └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Stat Cards Row (4 cards)                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Total   │  │  Active  │  │  Total   │  │ Pending │   │
│  │ Courses  │  │ Students │  │Enrollm.  │  │ Grading │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Main Content Area (2 columns on desktop)                   │
│  ┌──────────────────────┐  ┌──────────────────────┐      │
│  │  My Courses Table    │  │  Recent Enrollments   │      │
│  │  (with actions)      │  │  Feed                 │      │
│  │                       │  │                      │      │
│  └──────────────────────┘  └──────────────────────┘      │
│  ┌──────────────────────┐  ┌──────────────────────┐      │
│  │  Student Performance │  │  Course Analytics     │      │
│  │  Chart               │  │  (Line/Area Chart)    │      │
│  └──────────────────────┘  └──────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

#### Component Hierarchy

```
InstructorDashboardPage
├── InstructorDashboardHeader
│   ├── WelcomeMessage
│   ├── QuickActionButtons
│   │   ├── CreateCourseButton
│   │   └── ViewStudentsButton
│   └── NotificationBell
├── InstructorStatCards
│   ├── TotalCoursesCard
│   ├── ActiveStudentsCard
│   ├── TotalEnrollmentsCard
│   └── PendingGradingCard
├── MainContentGrid
│   ├── MyCoursesTable
│   │   └── TableLayout with CourseRow[]
│   ├── RecentEnrollmentsFeed
│   │   └── EnrollmentItem[]
│   ├── StudentPerformanceChart
│   │   └── PerformanceChart (LineChart)
│   └── CourseAnalyticsChart
│       └── AnalyticsChart (AreaChart)
└── InstructorSidebar (optional, collapsible)
    ├── QuickStats
    ├── RecentSubmissions
    └── UpcomingDeadlines
```

---

## 2. Color Scheme

### 2.1 Primary Color Palette

The application uses an **orange-based** color scheme as the primary brand color.

#### Primary Orange Colors

```css
/* Orange Primary */
--orange-50: #fff7ed;   /* Lightest background */
--orange-100: #ffedd5;  /* Light background */
--orange-200: #fed7aa;  /* Border/Light accent */
--orange-300: #fdba74;  /* Hover states */
--orange-400: #fb923c;  /* Secondary actions */
--orange-500: #f97316;  /* Primary actions, buttons */
--orange-600: #ea580c;  /* Hover states for buttons */
--orange-700: #c2410c;  /* Active states */
--orange-800: #9a3412;  /* Dark mode primary */
--orange-900: #7c2d12;  /* Darkest shade */
```

#### Usage Guidelines

- **Primary Buttons**: `bg-orange-500 hover:bg-orange-600`
- **Primary Text**: `text-orange-700` or `text-orange-900`
- **Borders**: `border-orange-200` or `border-orange-300`
- **Backgrounds**: `bg-orange-50` or `bg-orange-100/50`
- **Icons**: `text-orange-500` or `text-orange-600`

### 2.2 Status Colors

```css
/* Success (Green) */
--green-50: #f0fdf4;
--green-500: #22c55e;
--green-600: #16a34a;
--green-700: #15803d;

/* Warning (Yellow/Amber) */
--amber-50: #fffbeb;
--amber-500: #f59e0b;
--amber-600: #d97706;
--amber-700: #b45309;

/* Error (Red) */
--red-50: #fef2f2;
--red-500: #ef4444;
--red-600: #dc2626;
--red-700: #b91c1c;

/* Info (Blue) */
--blue-50: #eff6ff;
--blue-500: #3b82f6;
--blue-600: #2563eb;
--blue-700: #1d4ed8;
```

### 2.3 Neutral Colors

```css
/* Neutral Grays */
--neutral-50: #fafafa;
--neutral-100: #f5f5f5;
--neutral-200: #e5e5e5;
--neutral-300: #d4d4d4;
--neutral-400: #a3a3a3;
--neutral-500: #737373;
--neutral-600: #525252;
--neutral-700: #404040;
--neutral-800: #262626;
--neutral-900: #171717;
--neutral-950: #0a0a0a;
```

### 2.4 Component Color Variants

#### Stat Cards
- **Orange Card**: Schools/General stats
- **Blue Card**: Courses/Educational content
- **Purple Card**: Enrollments/Students
- **Green Card**: Success metrics
- **Teal Card**: Performance metrics

#### Badge Colors
- **Success**: `bg-green-100 text-green-700 border-green-300`
- **Warning**: `bg-amber-100 text-amber-700 border-amber-300`
- **Error**: `bg-red-100 text-red-700 border-red-300`
- **Info**: `bg-blue-100 text-blue-700 border-blue-300`
- **Default**: `bg-neutral-100 text-neutral-700 border-neutral-300`

### 2.5 Dark Mode Support

All components support dark mode using Tailwind's `dark:` prefix:

```css
/* Example */
.className {
  @apply bg-white dark:bg-neutral-900;
  @apply text-neutral-900 dark:text-neutral-100;
  @apply border-neutral-200 dark:border-neutral-800;
}
```

---

## 3. Reusable Components

### 3.1 Stat Card Component

A reusable stat card component with icon, value, label, and optional growth indicator.

**File**: `src/components/shared/stat-card.tsx`

```typescript
"use client"

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  growth?: number
  variant?: "orange" | "blue" | "purple" | "green" | "teal"
  className?: string
}

const variantStyles = {
  orange: {
    card: "border-orange-200 bg-linear-to-br from-orange-50 to-orange-100/50",
    label: "text-orange-700",
    value: "text-orange-900",
    iconBg: "bg-orange-500",
    badge: "border-orange-300 bg-orange-50 text-orange-700",
  },
  blue: {
    card: "border-blue-200 bg-linear-to-br from-blue-50 to-blue-100/50",
    label: "text-blue-700",
    value: "text-blue-900",
    iconBg: "bg-blue-500",
    badge: "border-blue-300 bg-blue-50 text-blue-700",
  },
  purple: {
    card: "border-purple-200 bg-linear-to-br from-purple-50 to-purple-100/50",
    label: "text-purple-700",
    value: "text-purple-900",
    iconBg: "bg-purple-500",
    badge: "border-purple-300 bg-purple-50 text-purple-700",
  },
  green: {
    card: "border-green-200 bg-linear-to-br from-green-50 to-green-100/50",
    label: "text-green-700",
    value: "text-green-900",
    iconBg: "bg-green-500",
    badge: "border-green-300 bg-green-50 text-green-700",
  },
  teal: {
    card: "border-teal-200 bg-linear-to-br from-teal-50 to-teal-100/50",
    label: "text-teal-700",
    value: "text-teal-900",
    iconBg: "bg-teal-500",
    badge: "border-teal-300 bg-teal-50 text-teal-700",
  },
}

export function StatCard({
  label,
  value,
  icon: Icon,
  growth,
  variant = "orange",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant]
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value

  return (
    <Card className={cn("rounded-xl p-6", styles.card, className)}>
      <CardContent className="flex flex-col gap-3 p-0">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className={cn("text-xs font-medium", styles.label)}>{label}</p>
            <p className={cn("text-xl font-bold", styles.value)}>
              {formattedValue}
            </p>
          </div>
          <div className={cn("rounded-lg p-2", styles.iconBg)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        {growth !== undefined && (
          <Badge variant="outline" className={cn("w-fit text-xs", styles.badge)}>
            {growth >= 0 ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {growth >= 0 ? "+" : ""}
            {growth}%
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
```

**Usage Example**:

```typescript
<StatCard
  label="Enrolled Courses"
  value={5}
  icon={BookOpen}
  growth={12.5}
  variant="blue"
/>
```

### 3.2 Course Card Component

A card component for displaying course information with progress indicator.

**File**: `src/components/shared/course-card.tsx`

```typescript
"use client"

import { BookOpen, Clock, User, Play } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

type CourseCardProps = {
  id: string
  title: string
  code?: string
  coverUrl?: string
  instructor?: {
    firstName?: string
    lastName?: string
    email: string
  }
  progress?: number // 0-100
  lastAccessed?: string
  status?: "in-progress" | "completed" | "not-started"
  className?: string
}

export function CourseCard({
  id,
  title,
  code,
  coverUrl,
  instructor,
  progress = 0,
  lastAccessed,
  status = "not-started",
  className,
}: CourseCardProps) {
  const instructorName = instructor
    ? `${instructor.firstName || ""} ${instructor.lastName || ""}`.trim() ||
      instructor.email
    : "Unknown Instructor"

  const statusColors = {
    "in-progress": "bg-blue-100 text-blue-700 border-blue-300",
    completed: "bg-green-100 text-green-700 border-green-300",
    "not-started": "bg-neutral-100 text-neutral-700 border-neutral-300",
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border border-neutral-200 hover:border-orange-300 transition-all duration-200",
        className
      )}
    >
      {coverUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1 line-clamp-2">
              {title}
            </h3>
            {code && (
              <p className="text-sm text-neutral-500 font-mono">{code}</p>
            )}
          </div>
          <Badge className={cn("text-xs", statusColors[status])}>
            {status === "in-progress"
              ? "In Progress"
              : status === "completed"
                ? "Completed"
                : "Not Started"}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <User className="h-4 w-4 text-orange-500" />
            <span className="truncate">{instructorName}</span>
          </div>
          {lastAccessed && (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Clock className="h-4 w-4 text-neutral-400" />
              <span>Last accessed: {new Date(lastAccessed).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600">Progress</span>
              <span className="font-semibold text-neutral-900">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          asChild
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Link href={`/student/courses/${id}`}>
            <Play className="mr-2 h-4 w-4" />
            {progress > 0 ? "Continue Learning" : "Start Course"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
```

**Usage Example**:

```typescript
<CourseCard
  id={course.id}
  title={course.title}
  code={course.code}
  coverUrl={course.coverUrl}
  instructor={course.instructor}
  progress={65}
  lastAccessed={course.lastAccessed}
  status="in-progress"
/>
```

### 3.3 Progress Indicator Component

A circular or linear progress indicator component.

**File**: `src/components/shared/progress-indicator.tsx`

```typescript
"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type ProgressIndicatorProps = {
  value: number // 0-100
  variant?: "circular" | "linear"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
  className?: string
}

export function ProgressIndicator({
  value,
  variant = "linear",
  size = "md",
  showLabel = true,
  label,
  className,
}: ProgressIndicatorProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100)

  if (variant === "circular") {
    const sizeClasses = {
      sm: "w-16 h-16",
      md: "w-24 h-24",
      lg: "w-32 h-32",
    }

    const strokeWidth = size === "sm" ? 4 : size === "md" ? 6 : 8
    const radius = size === "sm" ? 28 : size === "md" ? 40 : 56
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (clampedValue / 100) * circumference

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)}>
        <svg
          className={cn("transform -rotate-90", sizeClasses[size])}
          viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-neutral-200"
          />
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-orange-500 transition-all duration-500"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-neutral-900">{clampedValue}%</p>
              {label && <p className="text-xs text-neutral-500">{label}</p>}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Linear variant
  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-600">{label || "Progress"}</span>
          <span className="font-semibold text-neutral-900">{clampedValue}%</span>
        </div>
      )}
      <Progress value={clampedValue} className={cn(heightClasses[size])} />
    </div>
  )
}
```

**Usage Example**:

```typescript
<ProgressIndicator
  value={75}
  variant="circular"
  size="md"
  showLabel={true}
  label="Course Progress"
/>
```

### 3.4 Activity Feed Component

A component for displaying a feed of recent activities.

**File**: `src/components/shared/activity-feed.tsx`

```typescript
"use client"

import { Clock, BookOpen, CheckCircle, FileText, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

type ActivityType = "course" | "assignment" | "quiz" | "achievement" | "progress"

type ActivityItem = {
  id: string
  type: ActivityType
  title: string
  description?: string
  timestamp: string
  courseName?: string
}

type ActivityFeedProps = {
  activities: ActivityItem[]
  maxItems?: number
  className?: string
}

const activityIcons = {
  course: BookOpen,
  assignment: FileText,
  quiz: FileText,
  achievement: Award,
  progress: CheckCircle,
}

const activityColors = {
  course: "text-blue-500 bg-blue-50",
  assignment: "text-orange-500 bg-orange-50",
  quiz: "text-purple-500 bg-purple-50",
  achievement: "text-green-500 bg-green-50",
  progress: "text-teal-500 bg-teal-50",
}

export function ActivityFeed({
  activities,
  maxItems = 10,
  className,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems)

  return (
    <div className={cn("space-y-4", className)}>
      {displayedActivities.map((activity) => {
        const Icon = activityIcons[activity.type]
        const colorClass = activityColors[activity.type]

        return (
          <div
            key={activity.id}
            className="flex gap-4 p-4 rounded-xl border border-neutral-200 hover:border-orange-300 transition-colors"
          >
            <div className={cn("rounded-lg p-2 shrink-0", colorClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 mb-1">
                {activity.title}
              </p>
              {activity.description && (
                <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
                  {activity.description}
                </p>
              )}
              {activity.courseName && (
                <p className="text-xs text-neutral-500 mb-2">
                  Course: {activity.courseName}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        )
      })}
      {activities.length === 0 && (
        <div className="text-center py-8 text-sm text-neutral-500">
          No recent activity
        </div>
      )}
    </div>
  )
}
```

**Usage Example**:

```typescript
<ActivityFeed
  activities={[
    {
      id: "1",
      type: "course",
      title: "Completed Module 3",
      description: "Introduction to React",
      timestamp: "2024-01-15T10:30:00Z",
      courseName: "Web Development",
    },
  ]}
  maxItems={5}
/>
```

### 3.5 Assignment Card Component

A card component for displaying assignment information.

**File**: `src/components/shared/assignment-card.tsx`

```typescript
"use client"

import { Calendar, Clock, FileText, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

type AssignmentCardProps = {
  id: string
  title: string
  courseName: string
  dueDate: string
  status: "pending" | "submitted" | "graded" | "overdue"
  score?: number
  maxScore?: number
  submittedAt?: string
  className?: string
}

export function AssignmentCard({
  id,
  title,
  courseName,
  dueDate,
  status,
  score,
  maxScore,
  submittedAt,
  className,
}: AssignmentCardProps) {
  const isOverdue = status === "overdue"
  const isGraded = status === "graded"
  const isSubmitted = status === "submitted"

  const statusConfig = {
    pending: {
      badge: "bg-amber-100 text-amber-700 border-amber-300",
      icon: Clock,
      label: "Pending",
      buttonText: "Submit Assignment",
      buttonVariant: "default" as const,
    },
    submitted: {
      badge: "bg-blue-100 text-blue-700 border-blue-300",
      icon: CheckCircle,
      label: "Submitted",
      buttonText: "View Submission",
      buttonVariant: "outline" as const,
    },
    graded: {
      badge: "bg-green-100 text-green-700 border-green-300",
      icon: CheckCircle,
      label: "Graded",
      buttonText: "View Feedback",
      buttonVariant: "outline" as const,
    },
    overdue: {
      badge: "bg-red-100 text-red-700 border-red-300",
      icon: XCircle,
      label: "Overdue",
      buttonText: "Submit Late",
      buttonVariant: "destructive" as const,
    },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Card
      className={cn(
        "rounded-xl border transition-all duration-200",
        isOverdue
          ? "border-red-200 hover:border-red-300"
          : "border-neutral-200 hover:border-orange-300",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {title}
            </h3>
            <p className="text-sm text-neutral-600">{courseName}</p>
          </div>
          <Badge className={cn("text-xs", config.badge)}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>
              Due: {new Date(dueDate).toLocaleDateString()}{" "}
              {new Date(dueDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {submittedAt && (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <FileText className="h-4 w-4 text-neutral-400" />
              <span>
                Submitted: {new Date(submittedAt).toLocaleDateString()}
              </span>
            </div>
          )}
          {isGraded && score !== undefined && maxScore !== undefined && (
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Award className="h-4 w-4 text-green-500" />
              <span className="text-green-700">
                Score: {score}/{maxScore} ({(score / maxScore) * 100}%)
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          asChild
          variant={config.buttonVariant}
          className={cn(
            "w-full",
            config.buttonVariant === "default" &&
              "bg-orange-500 hover:bg-orange-600 text-white"
          )}
        >
          <Link href={`/student/assignments/${id}`}>{config.buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
```

**Usage Example**:

```typescript
<AssignmentCard
  id={assignment.id}
  title={assignment.title}
  courseName={assignment.courseName}
  dueDate={assignment.dueDate}
  status="pending"
  maxScore={100}
/>
```

---

## 4. Component Usage Examples

### 4.1 Student Dashboard Page

**File**: `src/app/(protected)/student/dashboard/page.tsx`

```typescript
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { StatCard } from "@/components/shared/stat-card"
import { CourseCard } from "@/components/shared/course-card"
import { ActivityFeed } from "@/components/shared/activity-feed"
import { AssignmentCard } from "@/components/shared/assignment-card"
import { HoursChart } from "@/components/dashboard/hours-chart"
import { BookOpen, TrendingUp, FileText } from "lucide-react"
import type { Course } from "@/types/course"

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [activities, setActivities] = useState([])
  const [assignments, setAssignments] = useState([])
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    overallProgress: 0,
    pendingAssignments: 0,
  })

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        const [coursesRes, activitiesRes, assignmentsRes, statsRes] =
          await Promise.all([
            fetch("/api/student/courses", { credentials: "include" }),
            fetch("/api/student/activities", { credentials: "include" }),
            fetch("/api/student/assignments/upcoming", {
              credentials: "include",
            }),
            fetch("/api/student/stats", { credentials: "include" }),
          ])

        if (coursesRes.ok) {
          const data = await coursesRes.json()
          setCourses(data.courses || [])
        }

        if (activitiesRes.ok) {
          const data = await activitiesRes.json()
          setActivities(data.activities || [])
        }

        if (assignmentsRes.ok) {
          const data = await assignmentsRes.json()
          setAssignments(data.assignments || [])
        }

        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      }
    }

    if (user) {
      void fetchData()
    }
  }, [user])

  const firstName = user?.firstName || "there"

  return (
    <div className="flex flex-1 gap-6 bg-white h-full overflow-hidden">
      <div className="flex-1 min-w-0 px-6 pt-6 pb-6 overflow-y-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">
            Hello {firstName} 👋
          </h1>
          <p className="text-sm text-neutral-600">
            Welcome back! Continue your learning journey.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <StatCard
            label="Enrolled Courses"
            value={stats.enrolledCourses}
            icon={BookOpen}
            variant="blue"
          />
          <StatCard
            label="Overall Progress"
            value={`${stats.overallProgress}%`}
            icon={TrendingUp}
            variant="teal"
          />
          <StatCard
            label="Pending Assignments"
            value={stats.pendingAssignments}
            icon={FileText}
            variant="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* My Courses */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              My Courses
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {courses.slice(0, 3).map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Recent Activity
            </h2>
            <ActivityFeed activities={activities} maxItems={5} />
          </div>
        </div>

        {/* Charts and Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study Hours Chart */}
          <div>
            <HoursChart
              data={[
                { month: "Jan", study: 45, exams: 20 },
                { month: "Feb", study: 52, exams: 25 },
              ]}
            />
          </div>

          {/* Upcoming Assignments */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Upcoming Assignments
            </h2>
            <div className="space-y-4">
              {assignments.slice(0, 3).map((assignment) => (
                <AssignmentCard key={assignment.id} {...assignment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 4.2 Instructor Dashboard Page

**File**: `src/app/(protected)/instructor/dashboard/page.tsx`

```typescript
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { StatCard } from "@/components/shared/stat-card"
import { TableLayout } from "@/components/ui/table-layout"
import { BookOpen, Users, GraduationCap, FileText } from "lucide-react"
import type { Course } from "@/types/course"

export default function InstructorDashboardPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeStudents: 0,
    totalEnrollments: 0,
    pendingGrading: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, statsRes] = await Promise.all([
          fetch("/api/instructor/courses", { credentials: "include" }),
          fetch("/api/instructor/stats", { credentials: "include" }),
        ])

        if (coursesRes.ok) {
          const data = await coursesRes.json()
          setCourses(data.courses || [])
        }

        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      }
    }

    if (user) {
      void fetchData()
    }
  }, [user])

  const firstName = user?.firstName || "there"

  return (
    <div className="flex flex-1 gap-6 bg-white h-full overflow-hidden">
      <div className="flex-1 min-w-0 px-6 pt-6 pb-6 overflow-y-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">
            Hello {firstName} 👋
          </h1>
          <p className="text-sm text-neutral-600">
            Manage your courses and students.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <StatCard
            label="Total Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            variant="blue"
          />
          <StatCard
            label="Active Students"
            value={stats.activeStudents}
            icon={Users}
            variant="purple"
          />
          <StatCard
            label="Total Enrollments"
            value={stats.totalEnrollments}
            icon={GraduationCap}
            variant="green"
          />
          <StatCard
            label="Pending Grading"
            value={stats.pendingGrading}
            icon={FileText}
            variant="orange"
          />
        </div>

        {/* My Courses Table */}
        <div className="flex-1">
          <TableLayout
            searchPlaceholder="Search courses..."
            showAddButton={true}
            addButtonLabel="Create Course"
            onAddClick={() => {
              // Navigate to create course page
            }}
          >
            {/* Table content */}
          </TableLayout>
        </div>
      </div>
    </div>
  )
}
```

---

## 5. Complete API Reference

### 5.1 Student API Endpoints

#### Get Enrolled Courses

**Endpoint**: `GET /api/student/courses`

**Description**: Returns all courses the student is enrolled in.

**Authentication**: Required (Student role)

**Query Parameters**:
- `status` (optional): Filter by status (`in-progress`, `completed`, `not-started`)

**Response**:
```json
{
  "courses": [
    {
      "id": "course-123",
      "title": "Introduction to Web Development",
      "code": "CS101",
      "summary": "Learn the fundamentals of web development",
      "coverUrl": "https://example.com/cover.jpg",
      "instructor": {
        "id": "instructor-123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "school": {
        "id": "school-123",
        "name": "Tech University"
      },
      "progress": 65,
      "lastAccessed": "2024-01-15T10:30:00Z",
      "status": "in-progress"
    }
  ]
}
```

#### Get Course Details

**Endpoint**: `GET /api/student/courses/:courseId`

**Description**: Returns detailed course information including modules and lectures.

**Authentication**: Required (Student role, must be enrolled)

**Response**:
```json
{
  "course": {
    "id": "course-123",
    "title": "Introduction to Web Development",
    "code": "CS101",
    "summary": "Learn the fundamentals",
    "coverUrl": "https://example.com/cover.jpg",
    "instructor": {
      "id": "instructor-123",
      "firstName": "John",
      "lastName": "Doe"
    },
    "modules": [
      {
        "id": "module-123",
        "title": "HTML Basics",
        "description": "Introduction to HTML",
        "order": 1,
        "lectures": [
          {
            "id": "lecture-123",
            "title": "HTML Structure",
            "type": "VIDEO",
            "order": 1,
            "progress": 100,
            "completed": true
          }
        ]
      }
    ],
    "progress": 65
  }
}
```

#### Get Student Progress

**Endpoint**: `GET /api/student/progress`

**Description**: Returns overall progress across all enrolled courses.

**Authentication**: Required (Student role)

**Response**:
```json
{
  "overallProgress": 65,
  "courses": [
    {
      "courseId": "course-123",
      "courseTitle": "Introduction to Web Development",
      "progress": 65,
      "completedModules": 3,
      "totalModules": 5,
      "completedLectures": 12,
      "totalLectures": 20
    }
  ],
  "totalStudyHours": 45,
  "lastActivity": "2024-01-15T10:30:00Z"
}
```

#### Update Lecture Progress

**Endpoint**: `PUT /api/student/progress/lectures/:lectureId`

**Description**: Updates progress for a specific lecture.

**Authentication**: Required (Student role)

**Request Body**:
```json
{
  "progress": 100,
  "completed": true,
  "timeSpent": 1800
}
```

**Response**:
```json
{
  "lectureId": "lecture-123",
  "progress": 100,
  "completed": true,
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Get Upcoming Assignments

**Endpoint**: `GET /api/student/assignments/upcoming`

**Description**: Returns upcoming assignments for the student.

**Authentication**: Required (Student role)

**Query Parameters**:
- `limit` (optional): Number of results (default: 10)

**Response**:
```json
{
  "assignments": [
    {
      "id": "assignment-123",
      "title": "JavaScript Fundamentals Quiz",
      "courseId": "course-123",
      "courseName": "Introduction to Web Development",
      "dueDate": "2024-01-20T23:59:59Z",
      "status": "pending",
      "maxScore": 100,
      "submittedAt": null
    }
  ]
}
```

#### Submit Assignment

**Endpoint**: `POST /api/student/assignments/:assignmentId/submit`

**Description**: Submits an assignment.

**Authentication**: Required (Student role)

**Request Body** (FormData):
```
files: File[]
notes: string (optional)
```

**Response**:
```json
{
  "submission": {
    "id": "submission-123",
    "assignmentId": "assignment-123",
    "submittedAt": "2024-01-15T10:30:00Z",
    "files": [
      {
        "id": "file-123",
        "name": "assignment.pdf",
        "url": "https://example.com/files/assignment.pdf"
      }
    ],
    "notes": "Completed assignment",
    "status": "submitted"
  }
}
```

#### Get Available Quizzes

**Endpoint**: `GET /api/student/quizzes`

**Description**: Returns available quizzes for the student.

**Authentication**: Required (Student role)

**Query Parameters**:
- `courseId` (optional): Filter by course
- `status` (optional): Filter by status (`available`, `completed`, `in-progress`)

**Response**:
```json
{
  "quizzes": [
    {
      "id": "quiz-123",
      "title": "JavaScript Fundamentals",
      "courseId": "course-123",
      "courseName": "Introduction to Web Development",
      "timeLimit": 3600,
      "maxScore": 100,
      "status": "available",
      "attempts": [],
      "bestScore": null
    }
  ]
}
```

#### Submit Quiz Attempt

**Endpoint**: `POST /api/student/quizzes/:quizId/attempts`

**Description**: Submits a quiz attempt.

**Authentication**: Required (Student role)

**Request Body**:
```json
{
  "answers": [
    {
      "questionId": "question-123",
      "answer": "option-a"
    }
  ],
  "timeSpent": 1800
}
```

**Response**:
```json
{
  "attempt": {
    "id": "attempt-123",
    "quizId": "quiz-123",
    "score": 85,
    "maxScore": 100,
    "percentage": 85,
    "submittedAt": "2024-01-15T10:30:00Z",
    "timeSpent": 1800,
    "answers": [
      {
        "questionId": "question-123",
        "answer": "option-a",
        "correct": true
      }
    ]
  }
}
```

#### Get Recent Activity

**Endpoint**: `GET /api/student/activities`

**Description**: Returns recent activity feed for the student.

**Authentication**: Required (Student role)

**Query Parameters**:
- `limit` (optional): Number of results (default: 10)

**Response**:
```json
{
  "activities": [
    {
      "id": "activity-123",
      "type": "course",
      "title": "Completed Module 3",
      "description": "Introduction to React",
      "timestamp": "2024-01-15T10:30:00Z",
      "courseName": "Web Development",
      "courseId": "course-123"
    }
  ]
}
```

#### Get Student Statistics

**Endpoint**: `GET /api/student/stats`

**Description**: Returns dashboard statistics for the student.

**Authentication**: Required (Student role)

**Response**:
```json
{
  "enrolledCourses": 5,
  "overallProgress": 65,
  "pendingAssignments": 3,
  "completedAssignments": 12,
  "totalStudyHours": 45,
  "averageScore": 85
}
```

### 5.2 Instructor API Endpoints

#### Get Instructor Courses

**Endpoint**: `GET /api/instructor/courses`

**Description**: Returns all courses created by the instructor.

**Authentication**: Required (Instructor role)

**Query Parameters**:
- `status` (optional): Filter by status (`draft`, `published`)

**Response**:
```json
{
  "courses": [
    {
      "id": "course-123",
      "title": "Introduction to Web Development",
      "code": "CS101",
      "summary": "Learn the fundamentals",
      "coverUrl": "https://example.com/cover.jpg",
      "school": {
        "id": "school-123",
        "name": "Tech University"
      },
      "enrollmentCount": 25,
      "status": "published",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Course

**Endpoint**: `POST /api/instructor/courses`

**Description**: Creates a new course.

**Authentication**: Required (Instructor role)

**Request Body**:
```json
{
  "title": "Introduction to Web Development",
  "code": "CS101",
  "summary": "Learn the fundamentals of web development",
  "coverUrl": "https://example.com/cover.jpg",
  "schoolId": "school-123"
}
```

**Response**:
```json
{
  "course": {
    "id": "course-123",
    "title": "Introduction to Web Development",
    "code": "CS101",
    "summary": "Learn the fundamentals",
    "coverUrl": "https://example.com/cover.jpg",
    "instructorId": "instructor-123",
    "schoolId": "school-123",
    "status": "draft",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Course

**Endpoint**: `PUT /api/instructor/courses/:courseId`

**Description**: Updates course information.

**Authentication**: Required (Instructor role, must own course)

**Request Body**:
```json
{
  "title": "Updated Course Title",
  "summary": "Updated summary",
  "coverUrl": "https://example.com/new-cover.jpg"
}
```

**Response**:
```json
{
  "course": {
    "id": "course-123",
    "title": "Updated Course Title",
    "summary": "Updated summary",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Course Modules

**Endpoint**: `GET /api/instructor/courses/:courseId/modules`

**Description**: Returns all modules for a course.

**Authentication**: Required (Instructor role, must own course)

**Response**:
```json
{
  "modules": [
    {
      "id": "module-123",
      "title": "HTML Basics",
      "description": "Introduction to HTML",
      "order": 1,
      "lectureCount": 5,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Module

**Endpoint**: `POST /api/instructor/courses/:courseId/modules`

**Description**: Creates a new module in a course.

**Authentication**: Required (Instructor role, must own course)

**Request Body**:
```json
{
  "title": "HTML Basics",
  "description": "Introduction to HTML",
  "order": 1
}
```

**Response**:
```json
{
  "module": {
    "id": "module-123",
    "title": "HTML Basics",
    "description": "Introduction to HTML",
    "order": 1,
    "courseId": "course-123",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Create Lecture

**Endpoint**: `POST /api/instructor/modules/:moduleId/lectures`

**Description**: Creates a new lecture in a module.

**Authentication**: Required (Instructor role, must own course)

**Request Body**:
```json
{
  "title": "HTML Structure",
  "description": "Learn about HTML document structure",
  "type": "VIDEO",
  "order": 1
}
```

**Response**:
```json
{
  "lecture": {
    "id": "lecture-123",
    "title": "HTML Structure",
    "description": "Learn about HTML document structure",
    "type": "VIDEO",
    "order": 1,
    "moduleId": "module-123",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Instructor Students

**Endpoint**: `GET /api/instructor/students`

**Description**: Returns all students enrolled in instructor's courses.

**Authentication**: Required (Instructor role)

**Query Parameters**:
- `courseId` (optional): Filter by course

**Response**:
```json
{
  "students": [
    {
      "id": "student-123",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "enrollments": [
        {
          "courseId": "course-123",
          "courseTitle": "Introduction to Web Development",
          "progress": 65,
          "enrolledAt": "2024-01-01T00:00:00Z"
        }
      ]
    }
  ]
}
```

#### Get Student Progress

**Endpoint**: `GET /api/instructor/students/:studentId/progress`

**Description**: Returns progress for a specific student across instructor's courses.

**Authentication**: Required (Instructor role)

**Response**:
```json
{
  "student": {
    "id": "student-123",
    "firstName": "Jane",
    "lastName": "Doe"
  },
  "courses": [
    {
      "courseId": "course-123",
      "courseTitle": "Introduction to Web Development",
      "progress": 65,
      "completedModules": 3,
      "totalModules": 5,
      "lastActivity": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Create Assignment

**Endpoint**: `POST /api/instructor/courses/:courseId/assignments`

**Description**: Creates a new assignment for a course.

**Authentication**: Required (Instructor role, must own course)

**Request Body** (FormData):
```
title: string
description: string
dueDate: string (ISO 8601)
maxScore: number
files: File[] (optional)
```

**Response**:
```json
{
  "assignment": {
    "id": "assignment-123",
    "title": "JavaScript Fundamentals Quiz",
    "description": "Test your knowledge of JavaScript",
    "courseId": "course-123",
    "dueDate": "2024-01-20T23:59:59Z",
    "maxScore": 100,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Assignment Submissions

**Endpoint**: `GET /api/instructor/assignments/:assignmentId/submissions`

**Description**: Returns all submissions for an assignment.

**Authentication**: Required (Instructor role, must own course)

**Response**:
```json
{
  "submissions": [
    {
      "id": "submission-123",
      "assignmentId": "assignment-123",
      "student": {
        "id": "student-123",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@example.com"
      },
      "submittedAt": "2024-01-15T10:30:00Z",
      "status": "submitted",
      "score": null,
      "gradedAt": null
    }
  ]
}
```

#### Grade Submission

**Endpoint**: `PUT /api/instructor/submissions/:submissionId/grade`

**Description**: Grades a submission.

**Authentication**: Required (Instructor role, must own course)

**Request Body**:
```json
{
  "score": 85,
  "maxScore": 100,
  "feedback": "Great work! Minor improvements needed."
}
```

**Response**:
```json
{
  "submission": {
    "id": "submission-123",
    "score": 85,
    "maxScore": 100,
    "percentage": 85,
    "feedback": "Great work! Minor improvements needed.",
    "gradedAt": "2024-01-15T10:30:00Z",
    "status": "graded"
  }
}
```

#### Get Instructor Statistics

**Endpoint**: `GET /api/instructor/stats`

**Description**: Returns dashboard statistics for the instructor.

**Authentication**: Required (Instructor role)

**Response**:
```json
{
  "totalCourses": 5,
  "activeStudents": 120,
  "totalEnrollments": 150,
  "pendingGrading": 8,
  "averageStudentProgress": 65,
  "totalAssignments": 25
}
```

#### Get Recent Enrollments

**Endpoint**: `GET /api/instructor/enrollments/recent`

**Description**: Returns recent enrollments in instructor's courses.

**Authentication**: Required (Instructor role)

**Query Parameters**:
- `limit` (optional): Number of results (default: 10)

**Response**:
```json
{
  "enrollments": [
    {
      "id": "enrollment-123",
      "course": {
        "id": "course-123",
        "title": "Introduction to Web Development"
      },
      "student": {
        "id": "student-123",
        "firstName": "Jane",
        "lastName": "Doe"
      },
      "enrolledAt": "2024-01-15T10:30:00Z",
      "status": "active"
    }
  ]
}
```

### 5.3 Error Handling

All API endpoints follow a consistent error response format:

**Error Response**:
```json
{
  "message": "Error message here",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

### 5.4 Authentication

All endpoints (except public health checks) require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Tokens are automatically refreshed using the refresh token mechanism implemented in `apiFetch`.

---

## 6. Implementation Notes

### 6.1 Component Organization

- **Shared Components**: Place in `src/components/shared/`
- **Student Components**: Place in `src/components/student/`
- **Instructor Components**: Place in `src/components/instructor/`
- **UI Components**: Use existing components from `src/components/ui/`

### 6.2 State Management

- Use React hooks (`useState`, `useEffect`) for local state
- Use `useAuth()` for authentication state
- Consider React Query or SWR for server state management

### 6.3 Form Handling

- Use `react-hook-form` with `zod` for validation
- Follow existing patterns from admin components
- Use `FileUpload` component for file uploads

### 6.4 Responsive Design

- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Test on multiple screen sizes

### 6.5 Performance

- Implement loading states for all async operations
- Use Suspense boundaries for data fetching
- Optimize images with Next.js Image component
- Lazy load heavy components

---

**Last Updated**: 2025-01-26  
**Version**: 1.0.0

