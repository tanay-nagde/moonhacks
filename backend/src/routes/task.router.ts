import express from "express";
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  submitTask,
  reviewTask,
} from "../controllers/taskcontroller";
import { isAuthenticated } from "../middleware/authmiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

// ✅ Create a task (Any logged-in user)
router.post("/", isAuthenticated, createTask);

// ✅ Get a task by ID (Public)
router.get("/:id", getTaskById);

// ✅ Update a task (Only assigned user/admin)
router.put("/:id", isAuthenticated, updateTask);

// ✅ Delete a task (Admins only)
router.delete("/:id", isAuthenticated, authorize(["admin"]), deleteTask);

// ✅ Assign task to a user (Admin)
router.put("/:id/assign", isAuthenticated, authorize(["admin"]), assignTask);

// ✅ Submit a task (Task assignee)
router.post("/:id/submit", isAuthenticated, submitTask);

// ✅ Review a submitted task (Admin)
router.put("/submission/:submissionId/review", isAuthenticated, authorize(["admin"]), reviewTask);

export default router;
