import express from "express";
import * as UserController from "../controllers/users";

const router = express.Router();

// GET routes for authenticated user
router.get("/", UserController.getAuthenticatedUser);

// POST routes for user signup and login
router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);

// you could make this GET because we dont send data
//  -> but POST is more appropriate
router.post("/logout", UserController.logout);

export default router;