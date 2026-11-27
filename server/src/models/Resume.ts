import mongoose, { Document, Schema } from "mongoose";

// ── Extracted data sub-schemas ────────────────────────────────────────────

export interface ISkill {
  name: string;
  category: string;
  evidence: string;
}

export interface IEducation {
  qualification: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: number | null;
}

export interface IExperience {
  organization: string;
  designation: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
}

export interface IProject {
  name: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface ICertification {
  name: string;
  issuer: string;
  issueDate: string | null;
}

export interface IExtractedData {
  skills: ISkill[];
  education: IEducation[];
  experience: IExperience[];
  projects: IProject[];
  certifications: ICertification[];
}

export type ResumeStatus = "uploaded" | "processing" | "completed" | "failed";

export interface IResume extends Document {
  userId: string;           // Clerk user ID — never trusted from client
  originalFileName: string;
  fileType: "pdf" | "docx";
  fileSize: number;         // bytes
  storageKey: string;       // opaque key for private local storage
  status: ResumeStatus;
  extractedData: IExtractedData | null;
  processingError: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ── Sub-schemas ───────────────────────────────────────────────────────────

const skillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "General", trim: true },
    evidence: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const educationSchema = new Schema<IEducation>(
  {
    qualification: { type: String, trim: true, default: "" },
    institution: { type: String, trim: true, default: "" },
    fieldOfStudy: { type: String, trim: true, default: "" },
    graduationYear: { type: Number, default: null },
  },
  { _id: false }
);

const experienceSchema = new Schema<IExperience>(
  {
    organization: { type: String, trim: true, default: "" },
    designation: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    technologies: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
  },
  { _id: false }
);

const certificationSchema = new Schema<ICertification>(
  {
    name: { type: String, trim: true, default: "" },
    issuer: { type: String, trim: true, default: "" },
    issueDate: { type: String, default: null },
  },
  { _id: false }
);

const extractedDataSchema = new Schema<IExtractedData>(
  {
    skills: { type: [skillSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
  },
  { _id: false }
);

// ── Root schema ───────────────────────────────────────────────────────────

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    originalFileName: {
      type: String,
      required: [true, "Original file name is required"],
      trim: true,
      maxlength: [255, "File name too long"],
    },
    fileType: {
      type: String,
      enum: ["pdf", "docx"],
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
      min: [1, "File size must be positive"],
      max: [5 * 1024 * 1024, "File size cannot exceed 5 MB"],
    },
    storageKey: {
      type: String,
      required: true,
      // Never returned to client — omitted in toJSON transform below
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
      index: true,
    },
    extractedData: {
      type: extractedDataSchema,
      default: null,
    },
    processingError: {
      type: String,
      default: null,
      maxlength: [500, "Processing error message too long"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        // NEVER expose the storage key to the client
        (ret as Record<string, unknown>).storageKey = undefined;
        (ret as Record<string, unknown>).__v = undefined;
        return ret;
      },
    },
  }
);

export const Resume =
  mongoose.models.Resume ?? mongoose.model<IResume>("Resume", resumeSchema);
