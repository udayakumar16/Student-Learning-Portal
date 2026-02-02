import mongoose, { Schema, type InferSchemaType } from "mongoose";

const supportRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    issueType: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type SupportRequest = InferSchemaType<typeof supportRequestSchema>;

export const SupportRequestModel = mongoose.model("SupportRequest", supportRequestSchema);
