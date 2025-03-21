import express from "express";
import {
  createClub,
  updateClub,
  deleteClub,
  getClubById,
  getAllClubs,
  getClubMembers,
} from "../controllers/clubController";
import { isAuthenticated } from "../middleware/authmiddleware";
import { authorize } from "../middleware/roleMiddleware"; // Ensure only admins can access some routes

const router = express.Router();

// ✅ Create a club (Only Club Admin)
router.post("/", isAuthenticated, authorize(["admin"]), createClub);

// ✅ Update a club (Only Club Admin)
router.put("/:id", isAuthenticated, authorize(["admin"]), updateClub);

// ✅ Delete a club (Only Super Admin)
router.delete("/:id", isAuthenticated, authorize(["super-admin"]), deleteClub);

// ✅ Get club details by ID (Public)
router.get("/:id", getClubById);

// ✅ Get all clubs (Public)
router.get("/", getAllClubs);

// ✅ Get club members (Only Club Admin)
router.get("/:id/members", isAuthenticated, authorize(["admin"]), getClubMembers);

export default router;
