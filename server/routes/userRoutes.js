import express from "express";
import {getPublishedImages, getUser, loginUser, registerUser,} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { updateProfile } from "../controllers/userController.js";
import { changePassword } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUser);
userRouter.get("/published-images", getPublishedImages);
userRouter.post("/update-profile", protect, updateProfile);
userRouter.post("/change-password", protect, changePassword);

export default userRouter;