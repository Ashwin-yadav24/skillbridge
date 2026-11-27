import mongoose, { Document, Schema, Types } from "mongoose";
import type { VerificationStatus } from "./Skill";

/**
 * SkillBridge AI — Occupation Model
 *
 * Represents a job role / occupational standard.
 *
 * DATA INTEGRITY RULES:
 * - qpCode and qualificationCode must only be set when sourced from an
 *   official dataset (NSDC QP pack, NQR, SIDH).
 * - verificationStatus: "demo" means the record is demo data only.
 * - schemeAssociations.verified must be false unless a verifiable
 *   government source confirms the association.
 * - Never set verificationStatus to "verified" for seeded demo data.
 */

export interface ISchemeAssociation {
  schemeName: string;
  schemeCode?: string;
  evidenceUrl?: string;
  verified: boolean;
}

export interface IOccupationSource {
  name: string;
  url?: string;
  identifier?: string;
  importedAt?: Date;
  verifiedAt?: Date;
}

export interface IOccupation extends Document {
  title: string;
  slug: string;
  description?: string;
  sector: Types.ObjectId;
  subSector?: string;
  qualificationCode?: string;
  qpCode?: string;
  qualificationTitle?: string;
  nsqfLevel?: number;
  qualificationCriteria?: string;
  minimumEducation?: string;
  relatedCourses: string[];
  schemeAssociations: ISchemeAssociation[];
  sourceInformation: IOccupationSource;
  verificationStatus: VerificationStatus;
  lastVerifiedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schemeAssociationSchema = new Schema<ISchemeAssociation>(
  {
    schemeName: { type: String, required: true, trim: true },
    schemeCode: { type: String, trim: true },
    evidenceUrl: { type: String, trim: true },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const occupationSourceSchema = new Schema<IOccupationSource>(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    identifier: { type: String, trim: true },
    importedAt: { type: Date },
    verifiedAt: { type: Date },
  },
  { _id: false }
);

const occupationSchema = new Schema<IOccupation>(
  {
    title: {
      type: String,
      required: [true, "Occupation title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    sector: {
      type: Schema.Types.ObjectId,
      ref: "Sector",
      required: [true, "Sector is required"],
    },
    subSector: {
      type: String,
      trim: true,
      maxlength: [120, "Sub-sector cannot exceed 120 characters"],
    },
    qualificationCode: {
      type: String,
      trim: true,
      sparse: true,
    },
    qpCode: {
      type: String,
      trim: true,
      sparse: true,
    },
    qualificationTitle: {
      type: String,
      trim: true,
      maxlength: [300, "Qualification title cannot exceed 300 characters"],
    },
    nsqfLevel: {
      type: Number,
      min: [1, "NSQF level must be between 1 and 10"],
      max: [10, "NSQF level must be between 1 and 10"],
    },
    qualificationCriteria: {
      type: String,
      trim: true,
      maxlength: [2000, "Qualification criteria cannot exceed 2000 characters"],
    },
    minimumEducation: {
      type: String,
      trim: true,
      maxlength: [200, "Minimum education cannot exceed 200 characters"],
    },
    relatedCourses: {
      type: [String],
      default: [],
    },
    schemeAssociations: {
      type: [schemeAssociationSchema],
      default: [],
    },
    sourceInformation: {
      type: occupationSourceSchema,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ["demo", "imported", "verified", "pending"],
      default: "pending",
    },
    lastVerifiedAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        (ret as Record<string, unknown>).__v = undefined;
        return ret;
      },
    },
  }
);

occupationSchema.index({ slug: 1 }, { unique: true });
occupationSchema.index({ sector: 1 });
occupationSchema.index({ nsqfLevel: 1 });
occupationSchema.index({ verificationStatus: 1 });
occupationSchema.index({ qpCode: 1 }, { sparse: true });
occupationSchema.index({ isActive: 1 });
occupationSchema.index({ title: "text", description: "text" });

export const Occupation =
  mongoose.models.Occupation ??
  mongoose.model<IOccupation>("Occupation", occupationSchema);
