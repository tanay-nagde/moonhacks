import express from "express";
import passport from "passport";
import { googleAuthCallback} from "../controllers/authController";



const router = express.Router();

// Google OAuth route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);


// // Middleware to verify token
// const verifyToken = (req: any, res: any, next: any) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });

//     req.user = decoded;
//     next();
//   });
// };

// // Protected route to get user profile
// router.get("/user", verifyToken, getUserProfile);

export default router;
