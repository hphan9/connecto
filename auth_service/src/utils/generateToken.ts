import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Types } from 'mongoose';

// we should pass res here since we will return the cookie back to the client
export const generateTokenAndSetCookie = (
  _id: Types.ObjectId,
  username: String,
  useremail: String,
  res: Response
) => {
  const token = jwt.sign({ _id, username, useremail }, process.env.JWT_SECRET, {
    expiresIn: '15d'
  });
  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent xss attachs cross-site cripting attacks , this mean the token is accessible http only,
    sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== 'development'
  });
};
