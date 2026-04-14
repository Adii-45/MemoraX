import React, { useState } from "react";
import { User, Heart, MessageSquare, Repeat2 } from "lucide-react";
import CommentSection from "./CommentSection";
import communityService from "../../services/communityService";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const PostCard = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(user?.id) || false
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [repostsCount, setRepostsCount] = useState(post.reposts || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      // Optimistic UI update
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      const res = await communityService.likePost(post._id);
      if (res.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch (err) {
      // Revert optimism on error
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      toast.error("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleRepost = async () => {
    try {
      const res = await communityService.repostPost(post._id);
      if (res.success) {
        setRepostsCount(res.data.reposts);
        toast.success("Post reposted!");
      }
    } catch (err) {
      toast.error("Failed to repost");
    }
  };

  const toggleComments = () => setShowComments(!showComments);

  const handleCommentAdded = () => {
    setCommentsCount((prev) => prev + 1);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {post.user?.profileImage ? (
          <img
            src={post.user.profileImage}
            alt={post.user.username}
            className="w-10 h-10 rounded-full object-cover border border-neutral-800"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
            <User size={20} className="text-neutral-400" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-neutral-200">
            {post.user?.username || "Unknown User"}
          </h3>
          <p className="text-xs text-neutral-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-neutral-300 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="mt-3 rounded-xl max-h-96 w-full object-cover border border-neutral-800"
            loading="lazy"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-2 border-t border-neutral-800/60 mt-4">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isLiked
              ? "text-red-500"
              : "text-neutral-500 hover:text-red-400"
          }`}
        >
          <Heart
            size={18}
            className={isLiked ? "fill-current scale-110 transition-transform" : "transition-transform hover:scale-110"}
          />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={toggleComments}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            showComments ? "text-primary" : "text-neutral-500 hover:text-primary-dark"
          }`}
        >
          <MessageSquare size={18} />
          <span>{commentsCount}</span>
        </button>

        <button
          onClick={handleRepost}
          className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-green-500 transition-colors ml-auto"
        >
          <Repeat2 size={18} />
          <span>{repostsCount}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4">
          <CommentSection postId={post._id} onCommentAdded={handleCommentAdded} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
