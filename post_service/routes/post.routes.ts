import express from "express";
import { validateRoute } from "../middleware/validateRoute";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
} from "../controllers/post.controller";
import { body } from "express-validator";
const router = express.Router();

router.get("/all", validateRoute, getAllPosts);
// get all post liked by user id in the params
router.get("/likes/:id", validateRoute, getLikedPosts);
router.get("/following", validateRoute, getFollowingPosts);
router.get("/user/:username", validateRoute, getUserPosts);
router.post(
  "/create",
  [body("text", "img").exists(), body("text").isString()],
  validateRoute,
  createPost
);
router.post("/like/:id", validateRoute, likeUnlikePost);
router.post(
  "/comment/:id",
  [body("text").isString().withMessage("Comment must have text")],
  validateRoute,
  commentOnPost
);
router.delete("/:id", validateRoute, deletePost);

export default router;
