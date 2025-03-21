import express from "express";
import { getLeaderboard, getClubLeaderboard, updateLeaderboard } from "../controllers/leaderboardcontroller";
import { isAuthenticated } from "../middleware/authmiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

// ✅ Get overall leaderboard (Public)
router.get("/", getLeaderboard);

// ✅ Get club leaderboard (Public)
router.get("/:clubId", getClubLeaderboard);

// ✅ Update leaderboard (Admins only)
router.put("/", isAuthenticated, authorize(["admin", "super-admin"]), updateLeaderboard);

export default router;
