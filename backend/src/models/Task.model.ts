import { Document, Model, model, Schema } from "mongoose";

export interface ITask {
  clubId: string; // Foreign key to Clubs collection
  createdBy: string; // Foreign key to Users collection
  assignedTo: string; // Foreign key to Users collection
  title: string;
  description: string;
  attachments: string[]; // Array of files, links, or media
  status: "pending" | "in-progress" | "completed" | "rejected"; // Enum
  dueDate?: Date | null; // Nullable timestamp
  completedAt?: Date | null; // Nullable timestamp
}

interface ITaskDocument extends ITask, Document {}
type ITaskModel = Model<ITaskDocument>;

const TaskSchema = new Schema<ITaskDocument>(
  {
    clubId: { type: String, required: true, ref: "Club" }, // References Clubs collection
    createdBy: { type: String, required: true, ref: "User" }, // References Users collection
    assignedTo: { type: String, required: true, ref: "User" }, // References Users collection
    title: { type: String, required: true },
    description: { type: String, required: true },
    attachments: { type: [String], default: [] }, // Array of file URLs or links
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "rejected"],
      default: "pending",
    },
    dueDate: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const TaskModel: ITaskModel = model<ITaskDocument>("Task", TaskSchema);
