import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
} from "../services/post.service";
import { body } from "express-validator";
const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
// get all post liked by user id in the params
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post(
  "/create",
  [body("text", "img").exists(), body("text").isString()],
  protectRoute,
  createPost
);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post(
  "/comment/:id",
  [body("text").isString().withMessage("Comment must have text")],
  protectRoute,
  commentOnPost
);
router.delete("/:id", protectRoute, deletePost);

export default router;
