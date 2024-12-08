import express from "express";
import { signup, login, logout, getMe } from "../controllers/auth.controller";
import { body } from "express-validator";
import { protectRoute } from "../middleware/protectRoute";

const authRoutes = express.Router();

authRoutes.get("/me", protectRoute, getMe);
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
