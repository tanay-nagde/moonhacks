import { Document, Model, model, Schema } from "mongoose";

export interface ITaskSubmission {
  taskId: string; // Foreign key to Tasks collection
  submittedBy: string; // Foreign key to Users collection
  submissionText?: string | null; // Nullable text submission
  submissionFiles?: string[] | null; // Nullable array of file links
  submittedAt: Date; // Timestamp of submission
  reviewedBy?: string | null; // Nullable foreign key to Users collection
  reviewStatus: "pending" | "accepted" | "rejected"; // Enum status
  reviewComments?: string | null; // Nullable review comments
  reviewedAt?: Date | null; // Nullable review timestamp
}

interface ITaskSubmissionDocument extends ITaskSubmission, Document {}
type ITaskSubmissionModel = Model<ITaskSubmissionDocument>;

const TaskSubmissionSchema = new Schema<ITaskSubmissionDocument>(
  {
    taskId: { type: String, required: true, ref: "Task" }, // References Tasks collection
    submittedBy: { type: String, required: true, ref: "User" }, // References Users collection
    submissionText: { type: String, default: null }, // Nullable text submission
    submissionFiles: { type: [String], default: null }, // Nullable array of file URLs
    submittedAt: { type: Date, required: true, default: Date.now }, // Auto-set timestamp
    reviewedBy: { type: String, ref: "User", default: null }, // Nullable reviewer
    reviewStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    }, // Review status enum
    reviewComments: { type: String, default: null }, // Nullable review comments
    reviewedAt: { type: Date, default: null }, // Nullable review timestamp
  },
  { timestamps: false } // No need for automatic timestamps
);

export const TaskSubmissionModel: ITaskSubmissionModel = model<ITaskSubmissionDocument>(
  "TaskSubmission",
  TaskSubmissionSchema
);
