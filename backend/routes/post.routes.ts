import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  likeUnlikePost,
} from "../controllers/post.controller";
import { body } from "express-validator";
const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
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
