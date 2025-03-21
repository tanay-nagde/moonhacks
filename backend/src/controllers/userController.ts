import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authmiddleware"; // ✅ Correct import
import { IUser, UserModel } from "../models/User.model";
import ApiError from "../utils/ApiError";
import { asyncHandler } from "../utils/asynchandler";

/**
 * Get logged-in user profile
 */
export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  res.status(200).json({
    success: true,
    data: req.user,
  });
});

/**
 * Get user by ID
 */
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Get user by email
 */
export const getUserByEmail = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email } = req.params;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Update user profile
 */
export const updateUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!req.user || (req.user as IUser)._id.toString() !== id) {
    throw new ApiError(403, "Forbidden: You cannot edit this profile");
  }

  const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

/**
 * Delete user (Admin only)
 */
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!req.user || (req.user as IUser).role !== "admin") {
    throw new ApiError(403, "Forbidden: Only admins can delete users");
  }

  const user = await UserModel.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

/**
 * Get all users (Paginated) - Admin/Super Admin only
 */
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !["admin", "super-admin"].includes((req.user as IUser).role)) {
    throw new ApiError(403, "Forbidden: Only admins can view users");
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const users = await UserModel.find().skip(skip).limit(limit);
  const totalUsers = await UserModel.countDocuments();

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      total: totalUsers,
      page,
      limit,
    },
  });
});

/**
 * Change user role (Super Admin only)
 */
export const changeRole = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user as IUser).role !== "super-admin") {
    throw new ApiError(403, "Forbidden: Only super-admin can change roles");
  }

  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ["member", "sub-admin", "admin"];
  if (!validRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    data: user,
  });
});

/**
 * Add members to a club
 */
export const addMembers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !["admin", "super-admin"].includes((req.user as IUser).role)) {
    throw new ApiError(403, "Forbidden: Only admins can add members");
  }

  const { clubId, emails } = req.body; // Array of emails

  const users = await UserModel.updateMany(
    { email: { $in: emails } },
    { $set: { clubId, role: "member" } }
  );

  res.status(200).json({
    success: true,
    message: `${users.modifiedCount} members added to the club`,
  });
});

/**
 * Promote user to club admin
 */
export const makeAdmin = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user as IUser).role !== "super-admin") {
    throw new ApiError(403, "Forbidden: Only super-admin can promote users to admin");
  }

  const { id } = req.params;
  const user = await UserModel.findByIdAndUpdate(id, { role: "admin" }, { new: true });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User promoted to admin",
    data: user,
  });
});

/**
 * Promote user to sub-admin
 */
export const makeSubAdmin = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !["admin", "super-admin"].includes((req.user as IUser).role)) {
    throw new ApiError(403, "Forbidden: Only admins can promote users to sub-admin");
  }

  const { id } = req.params;
  const user = await UserModel.findByIdAndUpdate(id, { role: "sub-admin" }, { new: true });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User promoted to sub-admin",
    data: user,
  });
});
