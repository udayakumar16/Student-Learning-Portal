import mongoose, { Schema, type InferSchemaType } from "mongoose";

const subjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    label: { type: String, required: true, unique: true, trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type Subject = InferSchemaType<typeof subjectSchema>;

export const SubjectModel = mongoose.model("Subject", subjectSchema);
