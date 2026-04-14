import express from "express";
import protect from "../middleware/auth.js";
import upload from "../config/multer.js";
import {
  createPost,
  getAllPosts,
  likePost,
  createComment,
  getPostComments,
  repostPost,
} from "../controllers/communityController.js";

const router = express.Router();

// Apply auth middleware to all community routes
router.use(protect);

router.post("/post", upload.single("image"), createPost);
router.get("/posts", getAllPosts);

router.put("/post/:id/like", likePost);

router.post("/post/:id/comment", createComment);
router.get("/post/:id/comments", getPostComments);

router.post("/post/:id/repost", repostPost);

export default router;
