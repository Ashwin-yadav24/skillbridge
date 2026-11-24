/**
 * SkillBridge AI — Mock Data
 *
 * All data in this file is for FRONTEND DEMONSTRATION ONLY.
 * None of this represents official PMKVY listings, government
 * statistics, or verified training information.
 *
 * Records are clearly marked with `isDemo: true`.
 */

import type {
  User,
  Occupation,
  SkillAssessment,
  Course,
  TrainingCentre,
  Roadmap,
  ProgressEntry,
  WeeklyActivity,
  FAQItem,
  ResumeData,
} from "@/types";

// ─── Current user ───

export const mockUser: User = {
  id: "demo-user-001",
  name: "Arjun Sharma",
  email: "arjun.sharma@example.com",
  role: "student",
  avatar: undefined,
  profileCompletion: 72,
  joinedAt: "2026-10-15",
};

// ─── Occupations ───

export const mockOccupations: Occupation[] = [
  {
    id: "occ-001",
    title: "Full Stack Developer",
    sector: "IT - ITeS",
    category: "Software Development",
    nsqfLevel: 7,
    qpCode: "SSC/Q0501",
    description:
      "Develops and maintains web applications using front-end and back-end technologies, databases, and APIs. Responsible for complete software lifecycle from design to deployment.",
    competencies: [
      { id: "c1", name: "HTML5 & CSS3", type: "mandatory", description: "Build semantic, accessible web interfaces" },
      { id: "c2", name: "JavaScript / TypeScript", type: "mandatory", description: "Implement client-side and server-side logic" },
      { id: "c3", name: "React.js", type: "mandatory", description: "Build component-based single-page applications" },
      { id: "c4", name: "Node.js", type: "mandatory", description: "Build scalable server-side applications" },
      { id: "c5", name: "Database Management", type: "mandatory", description: "Design and query SQL/NoSQL databases" },
      { id: "c6", name: "RESTful APIs", type: "mandatory", description: "Design, build, and consume REST APIs" },
      { id: "c7", name: "Git Version Control", type: "mandatory", description: "Manage code versions and collaborate" },
      { id: "c8", name: "Cloud Deployment", type: "optional", description: "Deploy applications to cloud platforms" },
      { id: "c9", name: "DevOps Basics", type: "optional", description: "CI/CD pipelines and containerization" },
      { id: "c10", name: "Testing", type: "optional", description: "Unit, integration and E2E testing" },
    ],
    relatedCourses: ["course-001", "course-002"],
    isDemo: true,
  },
  {
    id: "occ-002",
    title: "Data Analyst",
    sector: "IT - ITeS",
    category: "Data Science",
    nsqfLevel: 6,
    qpCode: "SSC/Q0502",
    description:
      "Collects, processes, and performs statistical analyses on large datasets. Discovers insights to inform business decisions using tools such as Python, SQL, and Excel.",
    competencies: [
      { id: "c11", name: "Python Programming", type: "mandatory", description: "Analyze data using Python and libraries" },
      { id: "c12", name: "SQL", type: "mandatory", description: "Query and manipulate relational databases" },
      { id: "c13", name: "Data Visualization", type: "mandatory", description: "Create charts and dashboards" },
      { id: "c14", name: "Statistics", type: "mandatory", description: "Apply statistical methods to data" },
      { id: "c15", name: "Excel / Spreadsheets", type: "mandatory", description: "Data analysis with spreadsheets" },
      { id: "c16", name: "Machine Learning Basics", type: "optional", description: "Build simple predictive models" },
      { id: "c17", name: "Power BI / Tableau", type: "optional", description: "Business intelligence dashboards" },
    ],
    relatedCourses: ["course-003"],
    isDemo: true,
  },
  {
    id: "occ-003",
    title: "Solar PV Installer",
    sector: "Renewable Energy",
    category: "Installation & Maintenance",
    nsqfLevel: 4,
    qpCode: "SGJ/Q0101",
    description:
      "Installs, maintains, and repairs solar photovoltaic systems on residential and commercial buildings. Ensures safety and compliance with electrical standards.",
    competencies: [
      { id: "c18", name: "Solar Panel Installation", type: "mandatory", description: "Mount and wire solar panels" },
      { id: "c19", name: "Electrical Safety", type: "mandatory", description: "Follow safety protocols" },
      { id: "c20", name: "Inverter Configuration", type: "mandatory", description: "Set up and configure inverters" },
      { id: "c21", name: "Site Assessment", type: "optional", description: "Evaluate site for solar potential" },
    ],
    relatedCourses: ["course-004"],
    isDemo: true,
  },
  {
    id: "occ-004",
    title: "General Duty Assistant (Healthcare)",
    sector: "Healthcare",
    category: "Patient Care",
    nsqfLevel: 4,
    qpCode: "HSS/Q5101",
    description:
      "Provides basic patient care under supervision, assists nurses and doctors, and maintains a hygienic healthcare environment.",
    competencies: [
      { id: "c22", name: "Patient Care Fundamentals", type: "mandatory", description: "Assist with daily patient needs" },
      { id: "c23", name: "Infection Control", type: "mandatory", description: "Follow hygiene and sterilization procedures" },
      { id: "c24", name: "First Aid", type: "mandatory", description: "Provide basic first aid and CPR" },
      { id: "c25", name: "Medical Terminology", type: "optional", description: "Understand medical terms" },
    ],
    relatedCourses: ["course-005"],
    isDemo: true,
  },
  {
    id: "occ-005",
    title: "Retail Sales Associate",
    sector: "Retail",
    category: "Sales & Customer Service",
    nsqfLevel: 4,
    qpCode: "RAS/Q0104",
    description:
      "Assists customers in retail stores, manages product displays, processes transactions, and provides product information and customer service.",
    competencies: [
      { id: "c26", name: "Customer Service", type: "mandatory", description: "Provide excellent customer support" },
      { id: "c27", name: "Product Knowledge", type: "mandatory", description: "Know product features and benefits" },
      { id: "c28", name: "POS Operations", type: "mandatory", description: "Process payments and returns" },
      { id: "c29", name: "Visual Merchandising", type: "optional", description: "Arrange product displays" },
    ],
    relatedCourses: ["course-006"],
    isDemo: true,
  },
  {
    id: "occ-006",
    title: "CNC Machine Operator",
    sector: "Automotive",
    category: "Manufacturing",
    nsqfLevel: 5,
    qpCode: "ASC/Q1402",
    description:
      "Operates CNC machines to manufacture precision parts for automotive and industrial applications. Reads technical drawings and maintains equipment.",
    competencies: [
      { id: "c30", name: "CNC Programming", type: "mandatory", description: "Program CNC machines using G-code" },
      { id: "c31", name: "Technical Drawing Reading", type: "mandatory", description: "Interpret blueprints and schematics" },
      { id: "c32", name: "Quality Control", type: "mandatory", description: "Measure and inspect parts" },
      { id: "c33", name: "Machine Maintenance", type: "optional", description: "Basic machine upkeep" },
    ],
    relatedCourses: [],
    isDemo: true,
  },
  {
    id: "occ-007",
    title: "Assistant Electrician",
    sector: "Construction",
    category: "Electrical Work",
    nsqfLevel: 4,
    qpCode: "CON/Q0602",
    description:
      "Assists in installing, maintaining, and repairing electrical wiring, fixtures, and equipment in residential and commercial buildings.",
    competencies: [
      { id: "c34", name: "Electrical Wiring", type: "mandatory", description: "Install and repair electrical wiring" },
      { id: "c35", name: "Safety Practices", type: "mandatory", description: "Follow electrical safety protocols" },
      { id: "c36", name: "Circuit Testing", type: "mandatory", description: "Test circuits with multimeters" },
      { id: "c37", name: "Blueprint Reading", type: "optional", description: "Read electrical blueprints" },
    ],
    relatedCourses: [],
    isDemo: true,
  },
  {
    id: "occ-008",
    title: "Media Content Creator",
    sector: "Electronics",
    category: "Media & Entertainment",
    nsqfLevel: 5,
    qpCode: "MES/Q0701",
    description:
      "Creates multimedia digital content including video, audio, graphics, and social media content for brands, organizations, and digital platforms.",
    competencies: [
      { id: "c38", name: "Video Editing", type: "mandatory", description: "Edit video using professional tools" },
      { id: "c39", name: "Graphic Design", type: "mandatory", description: "Create visual designs and layouts" },
      { id: "c40", name: "Social Media Strategy", type: "mandatory", description: "Plan and manage social media" },
      { id: "c41", name: "Photography", type: "optional", description: "Capture high-quality photos" },
      { id: "c42", name: "Copywriting", type: "optional", description: "Write engaging content" },
    ],
    relatedCourses: [],
    isDemo: true,
  },
];

export const sectorOptions = [
  "All Sectors",
  "IT - ITeS",
  "Healthcare",
  "Construction",
  "Automotive",
  "Retail",
  "Renewable Energy",
  "Electronics",
];

// ─── Skill Assessment ───

export const mockAssessment: SkillAssessment = {
  id: "assess-001",
  occupationId: "occ-001",
  occupationTitle: "Full Stack Developer",
  overallMatch: 68,
  matchedSkills: [
    { name: "HTML5 & CSS3", category: "Frontend", proficiency: "advanced", matched: true, importance: "critical", score: 95 },
    { name: "JavaScript", category: "Programming", proficiency: "advanced", matched: true, importance: "critical", score: 90 },
    { name: "React.js", category: "Frontend", proficiency: "intermediate", matched: true, importance: "critical", score: 78 },
    { name: "Git Version Control", category: "Tools", proficiency: "intermediate", matched: true, importance: "important", score: 80 },
    { name: "Node.js", category: "Backend", proficiency: "beginner", matched: true, importance: "critical", score: 55 },
  ],
  missingSkills: [
    { name: "TypeScript", category: "Programming", proficiency: "beginner", matched: false, importance: "critical" },
    { name: "Database Management", category: "Backend", proficiency: "beginner", matched: false, importance: "critical" },
    { name: "RESTful APIs", category: "Backend", proficiency: "beginner", matched: false, importance: "critical" },
    { name: "Cloud Deployment", category: "DevOps", proficiency: "beginner", matched: false, importance: "important" },
    { name: "DevOps Basics", category: "DevOps", proficiency: "beginner", matched: false, importance: "nice-to-have" },
    { name: "Testing", category: "Quality", proficiency: "beginner", matched: false, importance: "nice-to-have" },
  ],
  partialSkills: [
    { name: "Node.js", category: "Backend", proficiency: "beginner", matched: true, importance: "critical", score: 55 },
    { name: "React.js", category: "Frontend", proficiency: "intermediate", matched: true, importance: "critical", score: 78 },
  ],
  assessedAt: "2026-11-20",
  isDemo: true,
};

// ─── Courses ───

export const mockCourses: Course[] = [
  {
    id: "course-001",
    title: "Full Stack Web Development",
    sector: "IT - ITeS",
    provider: "Demo Training Partner",
    duration: "6 months",
    nsqfLevel: 7,
    eligibility: "Graduate or equivalent with basic programming knowledge",
    skills: ["JavaScript", "React.js", "Node.js", "MongoDB", "RESTful APIs"],
    description: "Comprehensive program covering modern full-stack web development with hands-on projects.",
    scheme: "PMKVY 4.0 (Demo)",
    isDemo: true,
  },
  {
    id: "course-002",
    title: "Frontend Development with React",
    sector: "IT - ITeS",
    provider: "Demo Training Partner",
    duration: "3 months",
    nsqfLevel: 6,
    eligibility: "12th pass with basic computer knowledge",
    skills: ["HTML5", "CSS3", "JavaScript", "React.js", "TypeScript"],
    description: "Learn modern frontend development focusing on React and responsive web design.",
    scheme: "PMKVY 4.0 (Demo)",
    isDemo: true,
  },
  {
    id: "course-003",
    title: "Data Analytics Fundamentals",
    sector: "IT - ITeS",
    provider: "Demo Training Partner",
    duration: "4 months",
    nsqfLevel: 6,
    eligibility: "Graduate with basic mathematics knowledge",
    skills: ["Python", "SQL", "Data Visualization", "Statistics", "Excel"],
    description: "Foundation course in data analytics covering Python, SQL, and visualization tools.",
    scheme: "PMKVY 4.0 (Demo)",
    isDemo: true,
  },
  {
    id: "course-004",
    title: "Solar PV Installation Technician",
    sector: "Renewable Energy",
    provider: "Demo Training Partner",
    duration: "3 months",
    nsqfLevel: 4,
    eligibility: "10th pass",
    skills: ["Solar Panel Installation", "Electrical Safety", "Inverter Configuration"],
    description: "Hands-on training in solar photovoltaic system installation and maintenance.",
    scheme: "PMKVY 4.0 (Demo)",
    isDemo: true,
  },
  {
    id: "course-005",
    title: "General Duty Assistant",
    sector: "Healthcare",
    provider: "Demo Healthcare Institute",
    duration: "6 months",
    nsqfLevel: 4,
    eligibility: "12th pass (Science preferred)",
    skills: ["Patient Care", "Infection Control", "First Aid", "Medical Terminology"],
    description: "Training in basic healthcare assistance and patient care fundamentals.",
    scheme: "PMKVY 4.0 (Demo)",
    isDemo: true,
  },
  {
    id: "course-006",
    title: "Retail Sales Associate Training",
    sector: "Retail",
    provider: "Demo Retail Academy",
    duration: "2 months",
    nsqfLevel: 4,
    eligibility: "10th pass",
    skills: ["Customer Service", "Product Knowledge", "POS Operations"],
    description: "Skill development program for retail sales and customer service.",
    scheme: "PMKVY 4.0 (Demo)",
    isDemo: true,
  },
];

// ─── Training centres ───

export const mockCentres: TrainingCentre[] = [
  {
    id: "tc-001",
    name: "Demo Skill Development Centre — Delhi",
    city: "New Delhi",
    state: "Delhi",
    sector: "IT - ITeS",
    courses: ["Full Stack Web Development", "Frontend Development with React"],
    contactEmail: "demo-delhi@example.com",
    contactPhone: "+91-11-XXXX-XXXX",
    isDemo: true,
  },
  {
    id: "tc-002",
    name: "Demo Training Institute — Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    sector: "IT - ITeS",
    courses: ["Data Analytics Fundamentals", "Full Stack Web Development"],
    contactEmail: "demo-mumbai@example.com",
    contactPhone: "+91-22-XXXX-XXXX",
    isDemo: true,
  },
  {
    id: "tc-003",
    name: "Demo Healthcare Training Centre — Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    sector: "Healthcare",
    courses: ["General Duty Assistant"],
    contactEmail: "demo-blr@example.com",
    contactPhone: "+91-80-XXXX-XXXX",
    isDemo: true,
  },
  {
    id: "tc-004",
    name: "Demo Renewable Energy Institute — Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    sector: "Renewable Energy",
    courses: ["Solar PV Installation Technician"],
    contactEmail: "demo-jaipur@example.com",
    contactPhone: "+91-141-XXXX-XXXX",
    isDemo: true,
  },
];

export const stateOptions = [
  "All States",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Rajasthan",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
];

// ─── Roadmap ───

export const mockRoadmap: Roadmap = {
  id: "roadmap-001",
  occupationTitle: "Full Stack Developer",
  milestones: [
    {
      id: "m1",
      title: "Programming Foundations",
      description: "Build strong fundamentals in JavaScript and TypeScript.",
      skills: ["JavaScript", "TypeScript", "Git"],
      suggestedCourses: ["Frontend Development with React"],
      projects: ["Build a personal portfolio website", "Create a CLI task manager"],
      status: "completed",
      order: 1,
    },
    {
      id: "m2",
      title: "Frontend Mastery",
      description: "Master React.js and modern frontend development.",
      skills: ["React.js", "HTML5 & CSS3", "Responsive Design"],
      suggestedCourses: ["Frontend Development with React"],
      projects: ["Build a weather dashboard app", "Create an e-commerce product page"],
      status: "in-progress",
      order: 2,
    },
    {
      id: "m3",
      title: "Backend Development",
      description: "Learn server-side development with Node.js and databases.",
      skills: ["Node.js", "Express.js", "MongoDB", "RESTful APIs"],
      suggestedCourses: ["Full Stack Web Development"],
      projects: ["Build a REST API for a blog", "Create a user authentication system"],
      status: "upcoming",
      order: 3,
    },
    {
      id: "m4",
      title: "Full Stack Integration",
      description: "Combine frontend and backend skills to build complete applications.",
      skills: ["Full Stack Architecture", "API Integration", "State Management"],
      suggestedCourses: ["Full Stack Web Development"],
      projects: ["Build a full-stack project management tool", "Deploy an application to the cloud"],
      status: "upcoming",
      order: 4,
    },
    {
      id: "m5",
      title: "DevOps & Professional Skills",
      description: "Learn deployment, testing, and professional development practices.",
      skills: ["Cloud Deployment", "DevOps Basics", "Testing"],
      suggestedCourses: [],
      projects: ["Set up a CI/CD pipeline", "Containerize an application with Docker"],
      status: "upcoming",
      order: 5,
    },
  ],
  createdAt: "2026-11-01",
  isDemo: true,
};

// ─── Progress ───

export const mockProgress: ProgressEntry[] = [
  { id: "p1", skill: "HTML5 & CSS3", status: "completed", completedAt: "2026-09-10" },
  { id: "p2", skill: "JavaScript", status: "completed", completedAt: "2026-10-05" },
  { id: "p3", skill: "React.js", status: "in-progress" },
  { id: "p4", skill: "Git Version Control", status: "in-progress" },
  { id: "p5", skill: "TypeScript", status: "not-started" },
  { id: "p6", skill: "Node.js", status: "not-started" },
  { id: "p7", skill: "Database Management", status: "not-started" },
  { id: "p8", skill: "RESTful APIs", status: "not-started" },
  { id: "p9", skill: "Cloud Deployment", status: "not-started" },
  { id: "p10", skill: "Testing", status: "not-started" },
];

export const mockWeeklyActivity: WeeklyActivity[] = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.5 },
  { day: "Wed", hours: 3 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 1 },
];

// ─── Landing page stats ───

export const landingStats = [
  { label: "CAREER PATHS", value: "120+", color: "text-[var(--sb-blue)]" },
  { label: "SKILLS MAPPED", value: "2,500+", color: "text-[var(--sb-green)]" },
  { label: "TRAINING PROGRAMS", value: "500+", color: "text-[var(--sb-orange)]" },
  { label: "ACTIVE LEARNERS", value: "10k+", color: "text-[var(--sb-purple)]" },
  { label: "COMPLETION RATE", value: "87%", color: "text-[var(--sb-red)]" },
];

// ─── FAQ ───

export const faqItems: FAQItem[] = [
  {
    question: "What is SkillBridge AI?",
    answer: "SkillBridge AI is a platform that uses artificial intelligence to analyze your resume, identify skill gaps against your desired occupation, and recommend relevant training programs and career roadmaps.",
  },
  {
    question: "Is SkillBridge AI affiliated with PMKVY?",
    answer: "SkillBridge AI is an independent platform. It references publicly available information about PMKVY-aligned training programs for educational purposes. Always verify details with official government sources.",
  },
  {
    question: "How does the skill gap analysis work?",
    answer: "You upload your resume, and our AI extracts your skills. You then select a target occupation, and the platform compares your skills against the required competencies using both exact matching and semantic similarity to give you a detailed analysis.",
  },
  {
    question: "Is my resume data secure?",
    answer: "Yes. Resume files are stored securely, and personal data is encrypted. We do not share your information with third parties. You can delete your data at any time.",
  },
  {
    question: "Can I use SkillBridge AI for free?",
    answer: "SkillBridge AI offers a free tier with basic resume analysis and skill gap identification. Advanced features like AI-generated roadmaps and detailed course recommendations may require a registered account.",
  },
  {
    question: "What file formats are supported for resume upload?",
    answer: "Currently, SkillBridge AI supports PDF and DOCX file formats for resume uploads.",
  },
];

// ─── Dashboard stats ───

export const dashboardStats = [
  { label: "Skill Match", value: "68%", color: "text-[var(--sb-blue)]", change: "+5%" },
  { label: "Matched Skills", value: "5", color: "text-[var(--sb-green)]", change: "+2" },
  { label: "Missing Skills", value: "6", color: "text-[var(--sb-orange)]", change: "-1" },
  { label: "Courses Recommended", value: "4", color: "text-[var(--sb-purple)]", change: "New" },
];

// ─── Resume mock ───

export const mockResume: ResumeData = {
  fileName: "arjun_sharma_resume.pdf",
  fileSize: 245760,
  uploadedAt: "2026-11-18",
  skills: ["HTML5", "CSS3", "JavaScript", "React.js", "Git", "Node.js (basic)", "Python (basic)"],
  education: ["B.Tech Computer Science — Demo University, 2024"],
  experience: ["Frontend Intern — Demo Tech Corp (3 months)"],
  projects: ["Portfolio website", "Weather app", "Todo application"],
};

