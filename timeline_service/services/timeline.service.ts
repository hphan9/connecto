import redis from "redis";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Message } from "kafkajs";
import redisClient from "../cache/redis.client";
import User from "../models/user.model";
import Post from "../models/post.model";
import { json } from "stream/consumers";
import { Types } from "mongoose";
import { MessageType } from "../types/subscription.type";
export const getFeed = async (req: Request, res: Response) => {
  const user = req.user;
  // for every tweet receives from kafka
  // run a query to find list of follower of author of that tweet 
  // save that to redis cache 
  try {
    const followingPostsString = await redisClient.get(user._id);
    console.log(followingPostsString);
    if (followingPostsString) {
      res.status(200).json(JSON.parse(followingPostsString));
      return;
    }
    // query database to get feeds,
    const dbUser = await User.findById(user._id);
    const following = dbUser?.following;
    //todo: check the user data send back, do we need all user infor
    let followingPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    await redisClient.set(user._id, JSON.stringify(followingPosts));
    res.status(200).json(followingPosts);
  } catch (error) {
    console.log(`Error get following posts ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const createPostHandler = async (message: MessageType) => {
  try {
    const creatorId = message.userId;
    console.log(creatorId);
 
    if (!message.post) return;
    // save it to cache
    //cacheModel: key_userId of user;  value_ feeds of people that user follow
    const dbUser = await User.findById(creatorId);
    const post = message.post;
    const followers = dbUser?.followers;
    if (!followers) return;
    const addPost = async (userId: string) => {
      console.log(`Start User ${userId}`);
      let currPosts = await redisClient.get(userId);
      if (currPosts) {
        var newPosts = JSON.parse(currPosts);
        newPosts.push(post);
        await redisClient.set(userId, JSON.stringify(newPosts));
      } else {
        await redisClient.set(userId, JSON.stringify(post));
      }
    }
    const listOfTask = followers.map(async (f: Types.ObjectId) => {
        return addPost(f.toString())
    });
    Promise.all(listOfTask);
  } catch (error) {
    console.log(`Error handle create Post events  message ${error}`);
  }
}