import { Request, Response } from "express";
import User from "../models/user.model";
import { Types } from "mongoose";
import Post from "../models/post.model";
import { validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";
//import Notification from "../models/notification.model";
import { MessageBroker } from "../utils/broker";
import { PostEvent } from "../types/subscription.type";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    //populate is method to get other infor from other table/document
    const allPosts = await Post.find()
      .sort({ created: 1 })
      .populate({ path: "user", select: "-password" });
    if (allPosts.length === 0) {
      res.status(200).json([]);
      return;
    }
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(`Error get all post ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const getLikedPosts = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;
    var posts = await Post.find({ likes: { $eq: userId } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
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

export const getFollowingPosts = async (req: Request, res: Response) => {
  try {
    const following = req.user.following;
    const followingPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(followingPosts);
  } catch (error) {
    console.log(`Error get following posts ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPostConsumer = async (req: Request, res: Response) => {
  try {
    res.status(200).json("test");
  } catch (error) {
    console.log(`Error get all post ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};
export const getUserPosts = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }
    const posts = await Post.find({ user: user._id })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
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

export const createPost = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send(errors);
      return;
    }

    const { text } = req.body;
    let { img } = req.body;
    const user = req.user;

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: user._id,
      text: text,
      img: img,
    });

    await newPost.save();
    await MessageBroker.publish({
      topic: "PostEvents",
      event: PostEvent.CREATE_POST,
      message: {
        id: newPost._id.toString(),
        text: newPost.text,
        img: newPost.img,
      },
      headers: { userId: user._id.toString() },
    });

    res.status(201).json({ newPost });
  } catch (error: any) {
    console.log(`Error save new post ${error.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const likeUnlikePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.status(400).json({ error: "Post not found" });
      return;
    }
    const userId = req.user._id;
    const isLikeExist = post.likes.includes(userId);
    let updatedLikes = post.likes;
    if (isLikeExist) {
      // unlike post
      await post.updateOne({ $pull: { likes: { $eq: userId } } });
      updatedLikes = updatedLikes.filter(
        (l) => l.toString() !== userId.toString()
      );
    } else {
      // likepost
      await post.updateOne({ $push: { likes: userId } });
      //todo: remove notification from post service
      /*       const notification = new Notification({
        type: "like",
        from: userId,
        to: post.user,
      });
      await notification.save(); */
      updatedLikes.push(userId);
    }
    res.status(200).json(updatedLikes);
  } catch (error: any) {
    console.log(`Error like unlike post ${error.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const commentOnPost = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send(errors);
    return;
  }
  try {
    const { text: comment } = req.body;
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.status(400).json({ error: "Post not found" });
      return;
    }

    post.comments.push({ user: req.user._id, text: comment });
    await post.save();

    res.status(200).json(post.comments);
  } catch (error: any) {
    console.log(`Error comment post ${error.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    if (post.user.toString() !== req.user._id.toString()) {
      res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
      return;
    }
    if (post.img) {
      // we have to delete post img from cloudinary
      const imgId = post.img.split("/").pop()?.split(".")[0];
      imgId && (await cloudinary.uploader.destroy(imgId));
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(`Error delete  post ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};
