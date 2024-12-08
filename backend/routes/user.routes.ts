import express from "express";
import {
  followUnfollowUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller";
import { protectRoute } from "../middleware/protectRoute";

const router = express.Router();

// we use this route when we are in user profile page
router.get("/profile/:username", protectRoute, getUserProfile);

router.get("/suggested", protectRoute, getUserProfile);

router.post("/follow/:id", protectRoute, followUnfollowUser);

router.post("/update", protectRoute, updateUserProfile);

export default router;
