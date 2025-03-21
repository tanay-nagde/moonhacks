import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../controllers/authController";
import { UserModel, IUser } from "../models/User.model";
import { JWT_SECRET } from "../utils/constants";
import ApiError from "../utils/ApiError";
import { Profile } from "passport";
import { asyncHandler } from "../utils/asynchandler";

/**
 * Extend Request type to include user
 */
export interface AuthRequest extends Request {
  user?: IUser | Profile;
}

/**
 * Authentication Middleware
 */
export const isAuthenticated: RequestHandler = asyncHandler(async (req, res, next) => {
  let accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    if (!refreshToken) {
      console.log("run 1");
      throw new ApiError(401, "No token provided");
    }

    // Attempt to refresh access token
    console.log("run 2");
    const newTokens = await refreshAccessToken(refreshToken);
    if (!newTokens) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Set new tokens in cookies
    res.cookie("accessToken", newTokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    accessToken = newTokens.accessToken; // Use the new access token
    console.log("run 3");
  }

  // ✅ Verify Access Token
  const decoded = jwt.verify(accessToken, JWT_SECRET) as { id: string };
  const user = await UserModel.findById(decoded.id);
  console.log("run 4");

  if (!user) {
    console.log("run 5");
    throw new ApiError(401, "Unauthorized - User not found");
  }

  req.user = user;
  console.log("run 6");
  next();
});
