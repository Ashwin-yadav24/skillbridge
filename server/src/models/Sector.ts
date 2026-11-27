import mongoose, { Document, Schema } from "mongoose";

/**
 * SkillBridge AI — Sector Model
 *
 * Represents an industry sector under which occupations are classified.
 * Based on NSDC Sector Skill Council categorisation.
 */

export interface ISector extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sectorSchema = new Schema<ISector>(
  {
    name: {
      type: String,
      required: [true, "Sector name is required"],
      trim: true,
      maxlength: [120, "Sector name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
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

sectorSchema.index({ slug: 1 }, { unique: true });
sectorSchema.index({ isActive: 1 });

export const Sector =
  mongoose.models.Sector ?? mongoose.model<ISector>("Sector", sectorSchema);
