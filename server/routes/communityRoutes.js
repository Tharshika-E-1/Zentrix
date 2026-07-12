import express from "express";
import {
  publishPost,
  getPosts,
  likePost,
  deletePost,
} from "../controllers/communityController.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Get all community posts
router.get("/", getPosts);

// Publish a new post
router.post("/publish", protect, publishPost);

// Like a post
router.post("/like/:id", protect, likePost);

// Delete own post
router.delete("/:id", protect, deletePost);

export default router;