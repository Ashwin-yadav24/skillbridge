import mongoose, { Document, Schema } from "mongoose";

/**
 * SkillBridge AI — User Model
 *
 * Stores identity & profile data synced from Clerk.
 * Passwords are NEVER stored here — Clerk manages auth credentials.
 */

export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  profileImage?: string;
  role: "student" | "admin";
  education: {
    qualification?: string;
    institution?: string;
    graduationYear?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema(
  {
    qualification: { type: String, trim: true },
    institution: { type: String, trim: true },
    graduationYear: { type: Number, min: 1950, max: 2100 },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: [true, "Clerk ID is required"],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
      index: true,
    },
    profileImage: {
      type: String,
      default: undefined,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    education: {
      type: educationSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        // Never expose internal Mongoose __v
        (ret as Record<string, unknown>).__v = undefined;
        return ret;
      },
    },
  }
);

export const User = mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);

