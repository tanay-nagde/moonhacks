import { Document, Model, model, Schema } from "mongoose";

interface IEvent {
  clubId: string; // Foreign key to Clubs collection
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  venue: string;
  createdBy: string; // Foreign key to Users collection
  isPublic: boolean;
}

interface IEventDocument extends IEvent, Document {}
type IEventModel = Model<IEventDocument>;

const EventSchema = new Schema<IEventDocument>(
  {
    clubId: { type: String, required: true, ref: "Club" }, // References Clubs collection
    title: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    venue: { type: String, required: true },
    createdBy: { type: String, required: true, ref: "User" }, // References Users collection
    isPublic: { type: Boolean, required: true, default: true },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const Event: IEventModel = model<IEventDocument>("Event", EventSchema);
