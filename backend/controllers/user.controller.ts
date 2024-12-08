import { Request, Response } from "express";
import User from "../models/user.model";
import { Types } from "mongoose";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getUserProfile controller ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const followUnfollowUser = async (req: Request, res: Response) => {
  try {
    const currUser = req.user;
    const { targetUserId } = req.params;
    const targetUser = await User.findById(targetUserId).select("-password");
    if (!targetUser || !currUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (targetUserId == currUser._id) {
      res.status(400).json({ message: "You can't follow/unfollow yourself" });
      return;
    }

    // check follow unfollow in target User
    const isFollowing = targetUser.followers.includes(currUser._id);
    if (isFollowing) {
      // current user unfollow target User
      // update followers field of targetUserId to remove the current user Id
      // update following field of currentUser to remove the target user Id
      // The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currUser._id },
      });
      await User.findByIdAndUpdate(currUser._id, {
        $pull: { following: targetUserId },
      });
      res
        .status(200)
        .json({
          message: `Unfollowed user ${targetUser.username} successfully`,
        });
    } else {
      // current user follow target User
      // update followers field of targetUserId to include the current user Id
      // update following field of currentUser to include the target user Id
      await User.findByIdAndUpdate(targetUserId, {
        $push: { followers: currUser._id },
      });
      await User.findByIdAndUpdate(currUser._id, {
        $push: { following: targetUserId },
      });
      res
        .status(200)
        .json({ message: `Followed user ${targetUser.username}successfully` });
    }
  } catch (error) {
    console.log(`Error in followUnfollowUser controller:`, error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {};
