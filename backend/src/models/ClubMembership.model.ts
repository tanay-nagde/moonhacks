import { Document, Model, model, Schema } from "mongoose";

// Enum for ClubMember roles
enum ClubMemberRole {
  PRESIDENT = "president",
  VICE_PRESIDENT = "vice-president",
  ADMIN = "admin",
  MEMBER = "member",
}

// Interface for ClubMembers document
interface IClubMember {
  userId: string; // Foreign key to Users collection
  clubId: string; // Foreign key to Clubs collection
  role: ClubMemberRole;
  joinedAt: Date;
}

interface IClubMemberDocument extends IClubMember, Document {}
type IClubMemberModel = Model<IClubMemberDocument>;
const ClubMemberSchema = new Schema<IClubMemberDocument>(
  {
    userId: { type: String, required: true, ref: "User" }, // References Users collection
    clubId: { type: String, required: true, ref: "Club" }, // References Clubs collection
    role: {
      type: String,
      enum: Object.values(ClubMemberRole),
      required: true,
      default: ClubMemberRole.MEMBER,
    },
    joinedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const ClubMember : IClubMemberModel  = model<IClubMemberDocument>("ClubMember", ClubMemberSchema);
