import { Request, Response } from "express";
import User from "../models/user.model";
import { Types } from "mongoose";
import Post from "../models/post.model";
import { validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";
//import Notification from "../models/notification.model";
import { MessageBroker } from "../utils/broker";
import { PostEvent } from "../types/subscription.type";
import path from "path";
import { AuthUser } from "../global";
import Notification from "../models/notification.model";

export const fetchPosts = async () => {
  try {
    //populate is method to get other infor from other table/document
    const allPosts = await Post.find()
      .sort({ created: 1 })
      .populate({ path: "user", select: "-password" });
    return allPosts;
  } catch (error: any) {
    console.log(`Error get all post ${error}`);
    throw new Error(error);
  }
};

export const fetchLikedPosts = async (userId: string) => {
  try {
    var posts = await Post.find({ likes: { $eq: userId } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return posts;
  } catch (error) {
    console.log(`Error Get Liked posts ${error}`);
    throw error;
  }
};

export const fetchFollowingPosts = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    const following = user?.following;
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
    return followingPosts;
  } catch (error) {
    throw error;
  }
};

export const fetchUser = async (username: string) => {
  try {
    return await User.findOne({ username: username });
  } catch (error) {
    throw error;
  }
};

export const fetchUserPosts = async (userId: Types.ObjectId) => {
  try {
    const posts = await Post.find({ user: userId })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return posts;
  } catch (error) {
    console.log(`Error get user posts ${error}`);
    throw error;
  }
};

export const saveNewPost = async (text: string, img: any, user: AuthUser) => {
  try {
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: user?._id,
      text: text,
      img: img,
    });

    await newPost.save();
    await newPost.populate({ path: "user", select: "-password" });
    await MessageBroker.publish({
      topic: "PostEvents",
      event: PostEvent.CREATE_POST,
      message: {
        userId: user?._id.toString(),
        id: newPost._id.toString(),
        post: newPost,
      },
      headers: { userId: user?._id.toString() },
    });

    return newPost;
  } catch (error: any) {
    console.log(`Error save new post ${error.message}`);
    throw error;
  }
};

export const modifyPostLike = async (id: string, userId: Types.ObjectId) => {
  try {
    const post = await Post.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }
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
      const notification = new Notification({
        type: "like",
        from: userId,
        to: post.user,
      });
      await notification.save();
      updatedLikes.push(userId);
    }
    return updatedLikes;
  } catch (error: any) {
    throw error;
  }
};

export const updateCommentOnPost = async (
  id: string,
  comment: string,
  userId: string
) => {
  try {
    const post = await Post.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }
    post.comments.push({ user: userId, text: comment });
    await post.save();
    return post.comments;
  } catch (error: any) {
    console.log(`Error comment post ${error.message}`);
    throw error;
  }
};

export const removePost = async (id: string, userId: string) => {
  try {
    const post = await Post.findById(id);
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.user._id.toString() !== userId) {
      throw new Error("You are not allowed to delete this post");
    }
    if (post.img) {
      // we have to delete post img from cloudinary
      const imgId = post.img.split("/").pop()?.split(".")[0];
      imgId && (await cloudinary.uploader.destroy(imgId));
    }
    await Post.findByIdAndDelete(id);
  } catch (error) {
    console.log(`Error delete  post ${error}`);
    throw error;
  }
};
