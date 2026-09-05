/**
 * lib/user-types.ts
 *
 * Future User & Community Platform Data Models.
 *
 * Designed to separate static Platform Data (lessons, topics, guides)
 * from dynamic User Data (accounts, progress, streaks, bookmarks, likes, follows).
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: "member" | "author" | "creator" | "admin";
  bio?: string;
  githubHandle?: string;
  twitterHandle?: string;
  linkedinHandle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCourseEnrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  lastLessonSlug?: string;
  completedLessonSlugs: string[];
}

export interface UserBookmark {
  id: string;
  userId: string;
  contentId: string;
  contentType: "lesson" | "guide" | "project" | "update" | "interview" | "youtube" | "instagram";
  createdAt: string;
}

export interface UserTopicFollow {
  userId: string;
  topicSlug: string;
  followedAt: string;
}

export interface UserActivityStreak {
  userId: string;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActiveDate: string;
}
