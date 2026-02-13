import mongoose, { Schema, type InferSchemaType } from "mongoose";

const questionSchema = new Schema(
  {
    subject: { type: String, required: true, index: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctOption: { type: Number, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type Question = InferSchemaType<typeof questionSchema>;

export const QuestionModel = mongoose.model("Question", questionSchema);
