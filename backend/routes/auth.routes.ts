import express from "express";
import { signup, login, logout } from "../controllers/auth.controller";
import { body, validationResult } from "express-validator";

const authRoutes = express.Router();

authRoutes.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be in a valid format"),
    body("password")
      .isLength({ min: 4, max: 10 })
      .withMessage("Password Length must be between 4 and 10"),
  ],
  signup
);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
