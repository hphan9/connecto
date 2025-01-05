import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Types } from 'mongoose';

// we should pass res here since we will return the cookie back to the client
export const generateTokenAndSetCookie = (userId: Types.ObjectId, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d'
  });
  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent xss attachs cross-site cripting attacks , this mean the token is accessible http only,
    sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== 'development'
  });
};
