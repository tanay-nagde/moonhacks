import { Document, Model, model, Schema } from "mongoose";

interface ICredit {
  userId: string; // Foreign key to Users collection
  eventId?: string | null; // Nullable foreign key to Events collection
  clubId?: string | null; // Nullable foreign key to Clubs collection
  taskId?: string | null; // Nullable foreign key to Tasks collection
  points: number; // Points awarded
  reason: string; // Description of the reason for the credit
}

interface ICreditDocument extends ICredit, Document {}
type ICreditModel = Model<ICreditDocument>;

const CreditSchema = new Schema<ICreditDocument>(
  {
    userId: { type: String, required: true, ref: "User" }, // References Users collection
    eventId: { type: String, ref: "Event", default: null }, // Nullable reference to Events collection
    clubId: { type: String, ref: "Club", default: null }, // Nullable reference to Clubs collection
    taskId: { type: String, ref: "Task", default: null }, // Nullable reference to Tasks collection
    points: { type: Number, required: true }, // Required points field
    reason: { type: String, required: true }, // Required reason field
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const Credit: ICreditModel = model<ICreditDocument>("Credit", CreditSchema);
