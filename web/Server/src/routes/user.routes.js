import express from "express";

import { registerUser, loginUser, logoutUser, getUsers, getUserById, deleteUser, getCurrentUser} from "../controllers/user.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect,logoutUser);

router.get("/me", protect, getCurrentUser);

router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, deleteUser);

export default router;