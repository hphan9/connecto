import express from "express";
import {
  followUnfollowUser,
  getSuggestedProfile,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller";
import { protectRoute } from "../middleware/protectRoute";

const router = express.Router();

// we use this route when we are in user profile page
router.get("/profile/:username", protectRoute, getUserProfile);

router.get("/suggested", protectRoute, getSuggestedProfile);

router.post("/follow/:targetUserId", protectRoute, followUnfollowUser);

router.post("/update", protectRoute, updateUser);

export default router;
