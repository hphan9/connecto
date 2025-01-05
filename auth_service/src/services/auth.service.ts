import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { generateTokenAndSetCookie } from '../utils/generateToken';
import { validationResult } from 'express-validator';
// don't remove this line, it will cause compiler error
import user from '../../global';

export const signup = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send(errors);
      return;
    }
    const { fullName, username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: 'Username is already taken' });
      return;
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ error: 'Email is already taken' });
      return;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      username,
      email,
      password: hashedPassword
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.log(`Error save new user ${error}`);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log(username);
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ error: 'Invalid Username' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password.toString());
    if (!validPassword) {
      res.status(400).json({ error: 'Invalid Password' });
      return;
    }

    // we have to generate token again to send back to the browser
    generateTokenAndSetCookie(user._id, res);

    res.status(200).send({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg
    });
  } catch (error) {
    console.log(`Error log in user ${error}`);
    res.status(500).json({ error: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log(`Error log out user ${error}`);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in get me controller ${error}`);
    res.status(500).json({ error: 'Server error' });
  }
};
