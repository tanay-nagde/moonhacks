import { Router } from "express";
import {
  getMe,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getAllUsers,
  changeRole,
  addMembers,
  makeAdmin,
  makeSubAdmin
} from "../controllers/userController";
import { isAuthenticated } from "../middleware/authmiddleware";
import { authorize } from "../middleware/roleMiddleware"; // Import role middleware

const router = Router();

router.get("/me", isAuthenticated, getMe);
router.get("/:id", isAuthenticated, getUserById);
router.get("/email/:email", isAuthenticated, getUserByEmail);
router.put("/:id", isAuthenticated, updateUser);
router.delete("/:id", isAuthenticated, authorize(["admin"]), deleteUser);
router.get("/all", getAllUsers);
router.patch("/:id/role", isAuthenticated, authorize(["super-admin"]), changeRole);
router.post("/add-members", isAuthenticated, authorize(["admin", "super-admin"]), addMembers);
router.patch("/:id/make-admin", isAuthenticated, authorize(["super-admin"]), makeAdmin);
router.patch("/:id/make-subadmin", isAuthenticated, authorize(["admin", "super-admin"]), makeSubAdmin);

export default router;
