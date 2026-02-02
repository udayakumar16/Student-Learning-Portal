import mongoose, { Schema, type InferSchemaType } from "mongoose";

const resultSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type Result = InferSchemaType<typeof resultSchema>;

export const ResultModel = mongoose.model("Result", resultSchema);
