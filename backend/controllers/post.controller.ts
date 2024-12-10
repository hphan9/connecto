import { Request, Response } from "express";
import User from "../models/user.model";
import { Types } from "mongoose";
import Post from "../models/post.model";
import { validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";

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

    res.status(201).json({ newPost });
  } catch (error) {
    console.log(`Error save new post ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const likeUnlikePost = async (req: Request, res: Response) => {};
export const commentOnPost = async (req: Request, res: Response) => {};
export const deletePost = async (req: Request, res: Response) => {};
