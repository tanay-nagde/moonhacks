import dotenv from "dotenv";
import { Schema, model, Model, Types } from "mongoose";
import { sign } from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../utils/constants";

dotenv.config({ path: "./.env" });

// 🔹 Enum for User Roles
enum UserRole {
  SUPERADMIN = "super-admin",
  ADMIN = "admin",
  SUBADMIN = "subadmin",
  MEMBER = "member",
  DEV = "dev",
  GUEST = "guest"
}

// 🔹 API Response Type (No `_id`, No `refreshToken`)
interface IUser {
  _id: Types.ObjectId;
  displayName: string;
  name?: { firstname?: string; lastname?: string };
  oauthProvider: string;
  oauthId: string;
  avatar: string;
  email: string;
  role: UserRole;
  clubId?: string;
  membershipStatus?: string;
  isBanned: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  refreshToken ?: string;
}

// 🔹 Mongoose Document Type (Includes `_id` & Methods)
interface IUserDocument extends IUser {
  
  setRefreshToken(): string;
  setAccessToken(): string;
}

// 🔹 Mongoose Model Type
type IUserModel = Model<IUserDocument>;

// 🔹 Mongoose Schema
const UserSchema = new Schema<IUserDocument>(
  {
    displayName: { type: String, required: true },
    name: { type: { firstname: String, lastname: String }, required: false },
    oauthProvider: { type: String, required: true },
    oauthId: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    clubId: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    isBanned: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: null },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

// 🔹 Instance Method: Generate Refresh Token (DO NOT STORE IT IN DB)
UserSchema.methods.setRefreshToken = function (): string {
  return sign({ id: this._id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// 🔹 Instance Method: Generate Access Token
UserSchema.methods.setAccessToken = function (): string {
  return sign(
    { id: this._id, email: this.email, role: this.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// 🔹 Model Creation
const UserModel: IUserModel = model<IUserDocument>("User", UserSchema);

export { UserModel, IUser, IUserDocument, IUserModel, UserRole };
