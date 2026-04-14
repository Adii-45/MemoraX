import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";

// @desc Create a new post
// @route POST /api/community/post
// @access Private
export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: "Post content is required",
        statusCode: 400,
      });
    }

    let imageUrl = null;

    if (req.file) {
      const cloudinaryModule = await import("../config/cloudinary.js");
      const cloudinary = cloudinaryModule.default;

      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "community_posts" },
          (error, result) => {
            if (error) {
              reject(new Error("Cloudinary upload failed"));
            } else {
              imageUrl = result.secure_url;
              resolve();
            }
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const post = await Post.create({
      user: req.user.id,
      content,
      image: imageUrl,
    });

    const populatedPost = await post.populate("user", "username profileImage");

    res.status(201).json({
      success: true,
      data: populatedPost,
      message: "Post created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all posts with optional filter
// @route GET /api/community/posts?filter=all|my|liked
// @access Private
export const getAllPosts = async (req, res, next) => {
  try {
    const { filter = "all" } = req.query;
    const userId = req.user.id;

    let query = {};

    if (filter === "my") {
      query = { user: userId };
    } else if (filter === "liked") {
      query = { likes: userId };
    }

    const posts = await Post.find(query)
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle like on a post
// @route PUT /api/community/post/:id/like
// @access Private
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
        statusCode: 404,
      });
    }

    const userId = req.user.id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: {
        likes: post.likes,
        likesCount: post.likes.length,
        isLiked: !isLiked,
      },
      message: isLiked ? "Post unliked" : "Post liked",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create a comment on a post
// @route POST /api/community/post/:id/comment
// @access Private
export const createComment = async (req, res, next) => {
  try {
    const { content, isAnonymous } = req.body;
    const postId = req.params.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: "Comment content is required",
        statusCode: 400,
      });
    }

    const isAnon = isAnonymous === true || isAnonymous === "true";

    const commentData = {
      post: postId,
      content,
      isAnonymous: isAnon,
    };

    if (!isAnon) {
      commentData.user = req.user.id;
    }

    const comment = await Comment.create(commentData);

    // Update post comment count
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    const populatedComment = await comment.populate("user", "username profileImage");

    res.status(201).json({
      success: true,
      data: populatedComment,
      message: "Comment added successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get comments for a post
// @route GET /api/community/post/:id/comments
// @access Private
export const getPostComments = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId })
      .populate("user", "username profileImage")
      .sort({ createdAt: 1 }); // Oldest first for threads

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Repost a post
// @route POST /api/community/post/:id/repost
// @access Private
export const repostPost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { reposts: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        reposts: post.reposts,
      },
      message: "Post reposted successfully",
    });
  } catch (error) {
    next(error);
  }
};
