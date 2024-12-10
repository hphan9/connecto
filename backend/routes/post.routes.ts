import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import {
  commentOnPost,
  createPost,
  deletePost,
  likeUnlikePost,
} from "../controllers/post.controller";
import { body } from "express-validator";
const router = express.Router();

router.post(
  "/create",
  [body("text", "img").exists(), body("text").isString()],
  protectRoute,
  createPost
);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/", protectRoute, deletePost);

export default router;
