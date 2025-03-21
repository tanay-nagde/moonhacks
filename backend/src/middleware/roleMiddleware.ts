import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../controllers/authController";
import { IUser } from "../models/User.model";

/**
 * Middleware to restrict access based on user roles.
 * @param {string[]} roles - List of roles allowed to access the route.
 */
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !('role' in req.user) || !roles.includes((req.user as IUser).role)) {
      return res.status(403).json({ message: "Forbidden: You don't have permission" });
    }
    next();
  };
};
