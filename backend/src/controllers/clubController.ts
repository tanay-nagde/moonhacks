import { Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asynchandler";
import { AuthRequest } from "../middleware/authmiddleware";
import { ClubModel } from "../models/Club.model";
import { UserModel, IUser } from "../models/User.model";
import ApiError from "../utils/ApiError";

/**
 * @desc Create a new club (Only Club Admin)
 * @route POST /api/clubs
 * @access Club Admin
 */
export const createClub = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user as IUser).role !== "admin") {
    return next(new ApiError(403, "Forbidden: Only club admins can create a club"));
  }

  const { name, description } = req.body;
  const newClub = await ClubModel.create({ name, description, admin: (req.user as IUser)._id });

  res.status(201).json({
    success: true,
    data: newClub,
  });
});

/**
 * @desc Update club details
 * @route PUT /api/clubs/:id
 * @access Club Admin
 */
export const updateClub = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const club = await ClubModel.findById(id);
  if (!club) return next(new ApiError(404, "Club not found"));

  if (!req.user || (req.user as IUser).role.toString() !== "admin") {
    return next(new ApiError(403, "Forbidden: Only the club admin can update the club"));
  }

  const updatedClub = await ClubModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  res.status(200).json({
    success: true,
    data: updatedClub,
  });
});

/**
 * @desc Delete a club (Only Super Admin)
 * @route DELETE /api/clubs/:id
 * @access Super Admin
 */
export const deleteClub = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!req.user || (req.user as IUser).role !== "super-admin") {
    return next(new ApiError(403, "Forbidden: Only super-admin can delete a club"));
  }

  const club = await ClubModel.findByIdAndDelete(id);
  if (!club) return next(new ApiError(404, "Club not found"));

  res.status(200).json({
    success: true,
    message: "Club deleted successfully",
  });
});

/**
 * @desc Get club by ID
 * @route GET /api/clubs/:id
 * @access Public
 */
export const getClubById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const club = await ClubModel.findById(id);
  if (!club) return next(new ApiError(404, "Club not found"));

  res.status(200).json({
    success: true,
    data: club,
  });
});

/**
 * @desc Get all clubs
 * @route GET /api/clubs
 * @access Public
 */
export const getAllClubs = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const clubs = await ClubModel.find();

  res.status(200).json({
    success: true,
    data: clubs,
  });
});

/**
 * @desc Get list of club members
 * @route GET /api/clubs/:id/members
 * @access Club Admin
 */
export const getClubMembers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const club = await ClubModel.findById(id);
  if (!club) return next(new ApiError(404, "Club not found"));

  if (!req.user || (req.user as IUser).role.toString() !== "admin") {
    return next(new ApiError(403, "Forbidden: Only the club admin can view members"));
  }

  const members = await UserModel.find({ clubId: id });

  res.status(200).json({
    success: true,
    data: members,
  });
});
