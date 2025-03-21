import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, refreshAccessToken } from "../controllers/authController";
import { UserModel } from "../models/User.model";
import { JWT_SECRET } from "../utils/constants";
import ApiError from "../utils/ApiError";



export const authMiddleware = async (req: AuthRequest   , res: Response, next: NextFunction) => {
  try {
    let accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      if (!refreshToken) {
        console.log("run 1")
        throw new ApiError( 401, "No token provided");
      }

      //  Call the refresh token controller if accessToken is missing or expired
      console.log("run2")
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

      accessToken = newTokens.accessToken; // Update accessToken for verification
      console.log("run3")
    }

    // ✅ Verify Access Token
    const decoded = jwt.verify(accessToken, JWT_SECRET) as { id: string };
    const user = await UserModel.findById(decoded.id);
    console.log("run4")

    if (!user) {
        console.log("run5")
        throw new ApiError(401, "Unauthorized - User not found");

    }

    req.user = user; // Attach user object to request
    console.log("run6")
    next(); // Pass request to controller

  } catch (error) {
    console.error("Auth Middleware Error:", error);
    throw new ApiError(401, "Unauthorized - Invalid token" );
  }
};
