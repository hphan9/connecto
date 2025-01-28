import { NextFunction, Request, Response } from "express";
// Todo check the import sentence : why it need don't remove this line, it will cause compiler error
import user from "../global";
import axios from "axios";

const AUTH_SERVICE_BASE_URL =
  process.env.AUTH_SERVICE_BASE_URL || "http://localhost:8001";
export const validateRoute = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ error: "You need to login first" });
      return;
    }
    console.log(`${AUTH_SERVICE_BASE_URL}/validate`);
    const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/validate`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.status !== 200) {
      res.status(401).json({ error: "User not authorised" });
      return;
    }
    req.user = response.data.user;
    next();
  } catch (error) {
    console.log(`Error verify token in ValidateRoute middleware ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};
