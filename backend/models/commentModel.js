import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
