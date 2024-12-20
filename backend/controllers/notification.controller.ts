import { Request, Response } from "express";
import Notification from "../models/notification.model";
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    // if the user read the notification update it to true
    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications function", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in delete Notification function", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }
    if (notification.to !== userId) {
      res
        .status(404)
        .json({ error: "You are not allowed to delete this notification" });
    }

    await Notification.deleteOne({ _id: notificationId });
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in delete Notification function", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
