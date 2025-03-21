import { Document, Model, model, Schema } from "mongoose";

interface IEventRegistration {
  eventId: string; // Foreign key to Events collection
  userId: string; // Foreign key to Users collection
  registeredAt: Date;
  checkedIn: boolean;
}

interface IEventRegistrationDocument extends IEventRegistration, Document {}
type IEventRegistrationModel = Model<IEventRegistrationDocument>;

const EventRegistrationSchema = new Schema<IEventRegistrationDocument>(
  {
    eventId: { type: String, required: true, ref: "Event" }, // References Events collection
    userId: { type: String, required: true, ref: "User" }, // References Users collection
    registeredAt: { type: Date, required: true, default: Date.now }, // Auto set to current timestamp
    checkedIn: { type: Boolean, required: true, default: false }, // Default to false
  },
  { timestamps: false } // No need for createdAt & updatedAt since we have registeredAt
);

export const EventRegistration: IEventRegistrationModel = model<IEventRegistrationDocument>(
  "EventRegistration",
  EventRegistrationSchema
);
