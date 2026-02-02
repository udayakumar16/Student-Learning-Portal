import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const SUBJECTS = ["Python", "Artificial Intelligence", "DBMS"] as const;
export type Subject = (typeof SUBJECTS)[number];

const questionSchema = new Schema(
  {
    subject: { type: String, enum: SUBJECTS, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctOption: { type: Number, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type Question = InferSchemaType<typeof questionSchema>;

export const QuestionModel = mongoose.model("Question", questionSchema);
