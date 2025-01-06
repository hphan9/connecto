import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ error: 'You need to login first' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(401).json({ error: 'Unauthorized: Invalid Token' });
      return;
    }

    const user = await User.findById((<JwtPayload>decoded)._id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error verify token in protectRout middleware ${error}`);
    res.status(500).json({ error: 'Server error' });
  }
};
