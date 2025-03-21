import { Document, Model, model, Schema } from "mongoose";

interface ILeaderboard {
  userId: string; // Foreign key to Users collection
  totalPoints: number; // Total points accumulated by the user
  rank: number; // User's rank on the leaderboard
  lastUpdated: Date; // Timestamp of the last update
}

interface ILeaderboardDocument extends ILeaderboard, Document {}
type ILeaderboardModel = Model<ILeaderboardDocument>;

const LeaderboardSchema = new Schema<ILeaderboardDocument>(
  {
    userId: { type: String, required: true, ref: "User" }, // References Users collection
    totalPoints: { type: Number, required: true, default: 0 }, // Default points to 0
    rank: { type: Number, required: true }, // User's rank
    lastUpdated: { type: Date, required: true, default: Date.now }, // Auto-set timestamp
  },
  { timestamps: false } // No need for createdAt & updatedAt
);

export const Leaderboard: ILeaderboardModel = model<ILeaderboardDocument>(
  "Leaderboard",
  LeaderboardSchema
);
