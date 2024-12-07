import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  res.json({ data: "Signup route" });
};

export const login = async (req: Request, res: Response) => {
  res.json({ data: "Login route" });
};

export const logout = async (req: Request, res: Response) => {
  res.json({ data: "Logout route" });
};
