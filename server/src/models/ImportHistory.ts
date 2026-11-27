import mongoose, { Document, Schema } from "mongoose";

/**
 * SkillBridge AI — ImportHistory Model
 *
 * Records every import operation (preview or committed) for audit purposes.
 */

export type ImportFileType = "csv" | "json" | "excel";
export type ImportStatus = "preview" | "committed" | "failed";

export interface IImportError {
  row: number;
  field?: string;
  message: string;
}

// Rename to avoid clash with Mongoose Document's built-in 'errors' field
export interface IImportHistory extends Omit<Document, "errors"> {
  sourceName: string;
  sourceUrl?: string;
  importedBy: string; // Clerk userId
  fileType: ImportFileType;
  totalRecords: number;
  inserted: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: IImportError[];
  status: ImportStatus;
  previewOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const importErrorSchema = new Schema<IImportError>(
  {
    row: { type: Number, required: true },
    field: { type: String },
    message: { type: String, required: true },
  },
  { _id: false }
);

const importHistorySchema = new Schema<IImportHistory>(
  {
    sourceName: {
      type: String,
      required: [true, "Source name is required"],
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    importedBy: {
      type: String,
      required: [true, "Importer Clerk ID is required"],
    },
    fileType: {
      type: String,
      enum: ["csv", "json", "excel"],
      required: true,
    },
    totalRecords: { type: Number, default: 0 },
    inserted: { type: Number, default: 0 },
    updated: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    errors: { type: [importErrorSchema], default: [] },
    status: {
      type: String,
      enum: ["preview", "committed", "failed"],
      default: "preview",
    },
    previewOnly: { type: Boolean, default: false },
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

importHistorySchema.index({ importedBy: 1 });
importHistorySchema.index({ createdAt: -1 });
importHistorySchema.index({ status: 1 });

export const ImportHistory =
  mongoose.models.ImportHistory ??
  mongoose.model<IImportHistory>("ImportHistory", importHistorySchema);
