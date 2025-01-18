import express from "express";
import {
  followUnfollowUser,
  getSuggestedProfile,
  getUserProfile,
  updateUser,
} from "../service/user.service";
import { validateRoute } from "../middleware/validateRoute";

const router = express.Router();

// we use this route when we are in user profile page
router.get("/profile/:username", validateRoute, getUserProfile);

router.get("/suggested", validateRoute, getSuggestedProfile);

router.post("/follow/:targetUserId", validateRoute, followUnfollowUser);

router.post("/update", validateRoute, updateUser);

export default router;
