import { Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "../middleware/authmiddleware";
import { IUser } from "../models/User.model";
import { asyncHandler } from "../utils/asynchandler";
import ApiError from "../utils/ApiError";

/**
 * Middleware to restrict access based on user roles.
 * @param {string[]} roles - List of roles allowed to access the route.
 */
export const authorize = (roles: string[]): RequestHandler =>
  asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !("role" in req.user) || !roles.includes((req.user as IUser).role)) {
      throw new ApiError(403, "Forbidden: You don't have permission");
    }
    next();
  });
