import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../controllers/authController";
import { IUser, UserModel } from "../models/User.model";
import ApiError from "../utils/ApiError";


export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized: User not found"));
  }

  res.status(200).json({
    success: true,
    data: req.user,
  });
};


export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};


export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    if (!req.user || (req.user as IUser)._id.toString() !== id) {
      return next(new ApiError(403, "Forbidden: You cannot edit this profile"));
    }
  
    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  
    if (!updatedUser) {
      return next(new ApiError(404, "User not found"));
    }
  
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  };
  
  export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    if (!req.user || (req.user as IUser).role !== "admin") {
      return next(new ApiError(403, "Forbidden: Only admins can delete users"));
    }
  
    const user = await UserModel.findByIdAndDelete(id);
  
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
  
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  };
  
  export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // if (!req.user || !["admin", "super-admin"].includes((req.user as IUser).role)) {
    //   return next(new ApiError(403, "Forbidden: Only admins can view users"));
    // }
  
    const users = await UserModel.find();
  
    res.status(200).json({
      success: true,
      data: users,
    });
  };
  