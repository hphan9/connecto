import { Request, Response } from "express";
import { Types } from "mongoose";
import Post from "../models/post.model";
import { validationResult } from "express-validator";
import {
  fetchPosts,
  fetchLikedPosts,
  fetchFollowingPosts,
  fetchUser,
  fetchUserPosts,
  saveNewPost,
  modifyPostLike,
  updateCommentOnPost,
  removePost,
} from "../services/post.service";

export const getAllPosts = async (req: CustomRequest, res: Response) => {
  try {
    //populate is method to get other infor from other table/document
    const allPosts = await fetchPosts();

    if (allPosts.length === 0) {
      res.status(200).json([]);
      return;
    }
    res.status(200);
    res.json(allPosts);
  } catch (error) {
    console.log(`Error get all post ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const getLikedPosts = async (req: CustomRequest, res: Response) => {
  try {
    const { id: userId } = req.params;
    var posts = await fetchLikedPosts(userId);
    if (posts.length === 0) {
      res.status(200).json([]);
      return;
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(`Error Get Liked posts ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const getFollowingPosts = async (req: CustomRequest, res: Response) => {
  try {
    if (req.user?._id == undefined) {
      res.status(400).json("User is not logged in");
      return;
    }
    const followingPosts = await fetchFollowingPosts(req.user._id);
    res.status(200).json(followingPosts);
  } catch (error) {
    console.log(`Error get following posts ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const user = await fetchUser(username);
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }
    const posts = await fetchUserPosts(user._id);
    if (posts.length === 0) {
      res.status(200).json([]);
      return;
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(`Error get user posts ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const createPost = async (req: CustomRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send(errors);
      return;
    }

    const { text } = req.body;
    let { img } = req.body;
    const user = req.user;
    if (!user) {
      res.status(400).json("User must log in");
      return;
    }
    const newPost = await saveNewPost(text, img, user);
    res.status(201).json({ newPost });
  } catch (error: any) {
    console.log(`Error save new post ${error.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const likeUnlikePost = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = new Types.ObjectId(req.user?._id);
    const updatedLikes = await modifyPostLike(id, userId);
    res.status(200).json(updatedLikes);
  } catch (error: any) {
    console.log(`Error like unlike post ${error.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const commentOnPost = async (req: CustomRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send(errors);
    return;
  }
  try {
    const { text: comment } = req.body;
    const { id } = req.params;
    const userId = req.user?._id || "";
    const comments = await updateCommentOnPost(id, comment, userId);
    res.status(200).json(comments);
  } catch (error: any) {
    console.log(`Error comment post ${error.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req: CustomRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    await removePost(req.params.id, req.user?._id || "");
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(`Error delete  post ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};
