import {  Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asynchandler";
import { isAuthenticated } from "../middleware/authmiddleware";
import { authorize } from "../middleware/roleMiddleware";
import ApiError from "../utils/ApiError";
import { LeaderboardModel, ILeaderboard } from "../models/Leaderboard.model";
import { IUser, UserModel } from "../models/User.model";
import { AuthRequest } from "./authController";

/**
 * Get overall leaderboard
 */
export const getLeaderboard = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const leaderboard = await LeaderboardModel.find()
    .sort({ points: -1 }) // Sort by highest points
    .populate("user", "name email role"); // Populate user details

  res.status(200).json({
    success: true,
    data: leaderboard,
  });
});

/**
 * Get club-specific leaderboard
 */
export const getClubLeaderboard = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { clubId } = req.params;

  const leaderboard = await LeaderboardModel.find({ clubId })
    .sort({ points: -1 }) // Sort by highest points
    .populate("user", "name email role"); // Populate user details

  if (!leaderboard.length) {
    return next(new ApiError(404, "No leaderboard found for this club"));
  }

  res.status(200).json({
    success: true,
    data: leaderboard,
  });
});

/**
 * Update leaderboard (Admins only)
 */
export const updateLeaderboard = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || ((req.user as IUser).role !== "admin" && (req.user as IUser).role !== "super-admin")) {
    return next(new ApiError(403, "Forbidden: Only admins can update the leaderboard"));
  }

  const { userId, points } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  const leaderboardEntry = await LeaderboardModel.findOneAndUpdate(
    { user: userId },
    { points },
    { new: true, upsert: true } // Create new entry if not exists
  );

  res.status(200).json({
    success: true,
    message: "Leaderboard updated successfully",
    data: leaderboardEntry,
  });
});
