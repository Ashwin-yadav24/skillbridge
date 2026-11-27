import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * SkillBridge AI — Skill Model
 *
 * Represents a normalised skill or competency unit.
 * Skills are reused across multiple occupations via OccupationSkill.
 */

export type VerificationStatus = "demo" | "imported" | "verified" | "pending";

export interface ISkillSource {
  name: string;
  url?: string;
  identifier?: string;
  importedAt?: Date;
}

export interface ISkill extends Document {
  name: string;
  normalizedName: string;
  category: string;
  description?: string;
  synonyms: string[];
  relatedSkills: Types.ObjectId[];
  sourceInformation: ISkillSource;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const sourceInfoSchema = new Schema<ISkillSource>(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    identifier: { type: String, trim: true },
    importedAt: { type: Date },
  },
  { _id: false }
);

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      maxlength: [200, "Skill name cannot exceed 200 characters"],
    },
    normalizedName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Skill category is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    synonyms: {
      type: [String],
      default: [],
    },
    relatedSkills: {
      type: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
      default: [],
    },
    sourceInformation: {
      type: sourceInfoSchema,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ["demo", "imported", "verified", "pending"],
      default: "pending",
      index: true,
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

skillSchema.index({ normalizedName: 1 }, { unique: true });
skillSchema.index({ category: 1 });
skillSchema.index({ verificationStatus: 1 });

export const Skill =
  mongoose.models.Skill ?? mongoose.model<ISkill>("Skill", skillSchema);
