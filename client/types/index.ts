// ─── Core Types ───

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  avatar?: string;
  profileCompletion: number;
  joinedAt: string;
}

export interface Occupation {
  id: string;
  title: string;
  sector: string;
  category: string;
  nsqfLevel?: number;
  qpCode?: string;
  description: string;
  competencies: Competency[];
  relatedCourses: string[];
  isDemo: boolean;
}

export interface Competency {
  id: string;
  name: string;
  type: "mandatory" | "optional";
  description: string;
}

export interface Skill {
  name: string;
  category: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  matched: boolean;
  importance: "critical" | "important" | "nice-to-have";
  score?: number;
}

export interface SkillAssessment {
  id: string;
  occupationId: string;
  occupationTitle: string;
  overallMatch: number;
  matchedSkills: Skill[];
  missingSkills: Skill[];
  partialSkills: Skill[];
  assessedAt: string;
  isDemo: boolean;
}

export interface Course {
  id: string;
  title: string;
  sector: string;
  provider: string;
  duration: string;
  nsqfLevel?: number;
  eligibility: string;
  skills: string[];
  description: string;
  scheme?: string;
  isDemo: boolean;
}

export interface TrainingCentre {
  id: string;
  name: string;
  city: string;
  state: string;
  sector: string;
  courses: string[];
  contactEmail?: string;
  contactPhone?: string;
  isDemo: boolean;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  skills: string[];
  suggestedCourses: string[];
  projects: string[];
  status: "completed" | "in-progress" | "upcoming";
  order: number;
}

export interface Roadmap {
  id: string;
  occupationTitle: string;
  milestones: RoadmapMilestone[];
  createdAt: string;
  isDemo: boolean;
}

export interface ProgressEntry {
  id: string;
  skill: string;
  status: "completed" | "in-progress" | "not-started";
  completedAt?: string;
}

export interface WeeklyActivity {
  day: string;
  hours: number;
}

export interface ResumeData {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  skills: string[];
  education: string[];
  experience: string[];
  projects: string[];
}

export interface StatItem {
  label: string;
  value: string;
  color: string;
  icon?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

