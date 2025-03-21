import express from "express";
import { getMe, getUserById, updateUser ,getAllUsers
, deleteUser } from "../controllers/userController";



const router = express.Router();

router.get("/me", getMe);
router.get("/all", getAllUsers);
router.get("/:id", getUserById);

export default router;
