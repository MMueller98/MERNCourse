import express from "express";
import * as UserController from "../controllers/users";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

// GET routes for authenticated user
//  -> order matters (check for authentication first)
router.get("/", requiresAuth,  UserController.getAuthenticatedUser);

// POST routes for user signup and login
router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);

// you could make this GET because we dont send data
//  -> but POST is more appropriate
router.post("/logout", UserController.logout);

export default router;