import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * SkillBridge AI — OccupationSkill Model
 *
 * Junction table linking an Occupation to its required Skills.
 * Each record represents one skill requirement for one occupation.
 *
 * The compound index on (occupationId, skillId) enforces uniqueness —
 * a skill can only appear once per occupation.
 */

export type ProficiencyExpectation =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface IOccupationSkill extends Document {
  occupationId: Types.ObjectId;
  skillId: Types.ObjectId;
  competencyDescription?: string;
  importanceWeight: number;
  proficiencyExpectation: ProficiencyExpectation;
  mandatory: boolean;
  sourceReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const occupationSkillSchema = new Schema<IOccupationSkill>(
  {
    occupationId: {
      type: Schema.Types.ObjectId,
      ref: "Occupation",
      required: [true, "Occupation ID is required"],
    },
    skillId: {
      type: Schema.Types.ObjectId,
      ref: "Skill",
      required: [true, "Skill ID is required"],
    },
    competencyDescription: {
      type: String,
      trim: true,
      maxlength: [500, "Competency description cannot exceed 500 characters"],
    },
    importanceWeight: {
      type: Number,
      min: [0, "Importance weight must be between 0 and 1"],
      max: [1, "Importance weight must be between 0 and 1"],
      default: 0.5,
    },
    proficiencyExpectation: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "intermediate",
    },
    mandatory: {
      type: Boolean,
      default: false,
    },
    sourceReference: {
      type: String,
      trim: true,
      maxlength: [300, "Source reference cannot exceed 300 characters"],
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

// Compound unique index — one skill per occupation
occupationSkillSchema.index(
  { occupationId: 1, skillId: 1 },
  { unique: true }
);
occupationSkillSchema.index({ occupationId: 1 });
occupationSkillSchema.index({ skillId: 1 });

export const OccupationSkill =
  mongoose.models.OccupationSkill ??
  mongoose.model<IOccupationSkill>("OccupationSkill", occupationSkillSchema);
