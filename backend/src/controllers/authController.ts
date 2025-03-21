import  jwt  from 'jsonwebtoken';
import { Request, Response } from "express";
import { UserModel, IUser } from "../models/User.model";
import { Profile } from "passport-google-oauth20";
import ApiError from '../utils/ApiError';
import { JWT_REFRESH_SECRET } from '../utils/constants';

export interface AuthRequest extends Request {
  user?: Profile | IUser; // ✅ Make user optional to avoid runtime errors
}

export const googleAuthCallback = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract Google Profile Information
    const profile = req.user as Profile; // ✅ Explicitly type as Profile (OAuth User)
    const oauthId = profile.id;
    const email = profile.emails?.[0]?.value;
    const avatar = profile.photos?.[0]?.value;
    const displayName = profile.displayName;
    const name = {
      firstname: profile.name?.givenName,
      lastname: profile.name?.familyName,
    };
    console.log("Profile:", oauthId, email, avatar, displayName, name);

    // ✅ Check if user exists in DB
    let user = await UserModel.findOne({ oauthId: oauthId });
   
    if (!user) {
      user = await UserModel.create({
        oauthProvider: "google",
        oauthId,
        displayName,
        name,
        email,
        avatar,
        role: "user",
        isBanned: false,
        lastLoginAt: new Date(),
      });
      
      // 
    }
    else{
  
      await user.updateOne({ _id: user._id }, { lastLoginAt: new Date() });
    }
    const accessToken = user.setAccessToken();
    const refreshToken = user.setRefreshToken();

   try {
     user.refreshToken = refreshToken
     await  user.save()
   } catch (error) {
    console.log(error);
    
   }
   
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      
    });
    res.send(`<script>
      window.opener.postMessage(${JSON.stringify(user)}, "http://localhost:5173");
      window.close();
    </script>`);
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(`
      <script>
        window.opener.postMessage({ error: "Internal Server Error" }, "http://localhost:5173");
        window.close();
      </script>
    `);

  }
};


export const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Verify Refresh Token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };

    // Check if user exists and refresh token matches
    const user = await UserModel.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return null; // Token mismatch or user not found
    }

    // Generate new Access & Refresh Tokens
    const newAccessToken = user.setAccessToken();
    const newRefreshToken = user.setRefreshToken();
    // Update Refresh Token in DB (Ensures old tokens are invalidated)
    user.refreshToken = newRefreshToken;
   try {
     await user.save();
   } catch (error) {
    throw new ApiError(500, "refresh token not saved in Db error");

   }

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };

  } catch (error) {
    throw new ApiError(403, "Invalid refresh token");
  }
};
