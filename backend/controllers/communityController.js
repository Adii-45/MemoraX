import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import { createNotification } from "../utils/notificationHelper.js";

// @desc Create a new post
// @route POST /api/community/post
// @access Private
export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    let imageUrl = null;
    let fileUrl = null;
    let fileName = null;
    let fileType = null;

    if (!content && (!req.files || (!req.files.image && !req.files.file))) {
      return res.status(400).json({
        success: false,
        error: "Post content, image, or file is required",
        statusCode: 400,
      });
    }

    if (req.files) {
      const cloudinaryModule = await import("../config/cloudinary.js");
      const cloudinary = cloudinaryModule.default;

      if (req.files.image) {
        await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "community_posts" },
            (error, result) => {
              if (error) reject(new Error("Cloudinary image upload failed"));
              else {
                imageUrl = result.secure_url;
                resolve();
              }
            }
          );
          stream.end(req.files.image[0].buffer);
        });
      }

      if (req.files.file) {
        fileName = req.files.file[0].originalname;
        const fileMime = req.files.file[0].mimetype;
        const resourceType = fileMime.startsWith("image/") ? "image" : "raw";

        await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "community_posts", resource_type: resourceType },
            (error, result) => {
              if (error) reject(new Error("Cloudinary file upload failed"));
              else {
                fileUrl = result.secure_url;
                resolve();
              }
            }
          );
          stream.end(req.files.file[0].buffer);
        });

        fileType = resourceType;
      }
    }

    const post = await Post.create({
      user: req.user.id,
      content: content || "",
      image: imageUrl,
      file: fileUrl,
      fileName,
      fileType,
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
    } else if (filter === "reposts") {
      query = { repostedBy: userId };
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

// @desc Get a single post by shareId (public access)
// @route GET /api/community/post/share/:shareId
// @access Public
export const getSharedPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ shareId: req.params.shareId })
      .populate("user", "username profileImage");

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    const comments = await Comment.find({ post: post._id })
      .populate("user", "username profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...post.toObject(),
        comments,
      },
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

    // Fire-and-forget notification on like (not unlike)
    if (!isLiked) {
      createNotification({
        recipientId: post.user,
        triggerUserId: userId,
        type: "like_post",
        message: `${req.user.username} liked your post`,
        postId: post._id,
      });
    }

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

    // Fire-and-forget notification for comment
    const commentedPost = await Post.findById(postId).select("user");
    if (commentedPost && !isAnon) {
      createNotification({
        recipientId: commentedPost.user,
        triggerUserId: req.user.id,
        type: "comment_post",
        message: `${req.user.username} commented on your post`,
        postId: postId,
      });
    }

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
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
        statusCode: 404,
      });
    }

    const userId = req.user.id;
    const isReposted = post.repostedBy.includes(userId);

    if (isReposted) {
      post.repostedBy = post.repostedBy.filter((id) => id.toString() !== userId.toString());
      post.reposts -= 1;
    } else {
      post.repostedBy.push(userId);
      post.reposts += 1;
    }

    await post.save();

    // Fire-and-forget notification on repost (not un-repost)
    if (!isReposted) {
      createNotification({
        recipientId: post.user,
        triggerUserId: userId,
        type: "repost_post",
        message: `${req.user.username} reposted your post`,
        postId: post._id,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        reposts: post.reposts,
        repostedBy: post.repostedBy,
        isReposted: !isReposted,
      },
      message: isReposted ? "Post unreposted" : "Post reposted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update a post
// @route PUT /api/community/post/:id
// @access Private
export const updatePost = async (req, res, next) => {
  try {
    const { content } = req.body;
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this post",
      });
    }

    post.content = content || post.content;
    await post.save();

    post = await post.populate("user", "username profileImage");

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a post
// @route DELETE /api/community/post/:id
// @access Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this post",
      });
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: req.params.id });

    res.status(200).json({
      success: true,
      data: {},
      message: "Post removed",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update a comment
// @route PUT /api/community/comment/:id
// @access Private
export const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    if (comment.isAnonymous || comment.user?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this comment",
      });
    }

    comment.content = content || comment.content;
    await comment.save();
    
    comment = await comment.populate("user", "username profileImage");

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a comment
// @route DELETE /api/community/comment/:id
// @access Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    const post = await Post.findById(comment.post);

    if (
      (!comment.isAnonymous && comment.user?.toString() === req.user.id) ||
      (post && post.user.toString() === req.user.id)
    ) {
      await comment.deleteOne();

      if (post) {
        post.commentsCount = Math.max(0, post.commentsCount - 1);
        await post.save();
      }

      res.status(200).json({
        success: true,
        data: {},
        message: "Comment removed",
      });
    } else {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this comment",
      });
    }
  } catch (error) {
    next(error);
  }
};
