import React, { useState } from "react";
import {
  User,
  Heart,
  MessageSquare,
  Repeat2,
  MoreHorizontal,
  Pencil,
  Trash2,
  FileText,
  Download,
  X,
  Check,
  Loader2,
} from "lucide-react";
import CommentSection from "./CommentSection";
import communityService from "../../services/communityService";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(user?.id) || false
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isReposted, setIsReposted] = useState(
    post.repostedBy?.includes(user?.id) || false
  );
  const [repostsCount, setRepostsCount] = useState(post.reposts || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentContent, setCurrentContent] = useState(post.content || "");

  const isOwner = user?.id === post.user?._id;

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      const res = await communityService.likePost(post._id);
      if (res.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch (err) {
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      toast.error("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleRepost = async () => {
    if (isReposting) return;
    try {
      setIsReposting(true);
      // Optimistic update
      setIsReposted(!isReposted);
      setRepostsCount((prev) => (isReposted ? prev - 1 : prev + 1));

      const res = await communityService.repostPost(post._id);
      if (res.success) {
        setRepostsCount(res.data.reposts);
        setIsReposted(res.data.isReposted);
        toast.success(res.data.isReposted ? "Post reposted!" : "Repost removed");
      }
    } catch (err) {
      // Revert on error
      setIsReposted(!isReposted);
      setRepostsCount((prev) => (isReposted ? prev - 1 : prev + 1));
      toast.error("Failed to repost");
    } finally {
      setIsReposting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(currentContent);
    setShowMenu(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(currentContent);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    try {
      setIsSavingEdit(true);
      const res = await communityService.updatePost(post._id, editContent.trim());
      if (res.success) {
        setCurrentContent(res.data.content);
        setIsEditing(false);
        toast.success("Post updated");
        if (onPostUpdated) onPostUpdated(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update post");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      setIsDeleting(true);
      setShowMenu(false);
      const res = await communityService.deletePost(post._id);
      if (res.success) {
        toast.success("Post deleted");
        if (onPostDeleted) onPostDeleted(post._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleComments = () => setShowComments(!showComments);

  const handleCommentAdded = () => {
    setCommentsCount((prev) => prev + 1);
  };

  const handleCommentDeleted = () => {
    setCommentsCount((prev) => Math.max(0, prev - 1));
  };

  // Helper to get filename from URL
  const getFileDisplayName = () => {
    return post.fileName || "Attached file";
  };

  return (
    <div className={`bg-neutral-950 border border-neutral-800 rounded-2xl p-4 hover:border-neutral-700 transition-colors relative ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
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
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-200">
            {post.user?.username || "Unknown User"}
          </h3>
          <p className="text-xs text-neutral-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Owner Menu */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-36 bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-neutral-800 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-200 text-sm resize-none min-h-[80px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors custom-scrollbar"
              autoFocus
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={handleCancelEdit}
                disabled={isSavingEdit}
                className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || isSavingEdit}
                className="flex items-center gap-1.5 text-sm text-white bg-primary hover:bg-primary-dark px-4 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
              >
                {isSavingEdit ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-neutral-300 whitespace-pre-wrap">{currentContent}</p>
          </>
        )}

        {/* Image display — fixed portrait support */}
        {post.image && (
          <div className="flex justify-center items-center">
            <img
              src={post.image}
              alt="Post content"
              className="w-full max-h-[500px] object-contain rounded-xl bg-black border border-neutral-800 shadow-md"
              loading="lazy"
            />
          </div>
        )}

        {/* File attachment display */}
        {post.file && (
          <div className="flex items-center gap-3 bg-neutral-900/60 border border-neutral-800/50 rounded-xl px-4 py-3 group hover:border-neutral-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-200 truncate">
                {getFileDisplayName()}
              </p>
              <p className="text-xs text-neutral-500">Attached file</p>
            </div>
            <a
              href={post.file}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Download size={16} />
              Download
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-neutral-800/40 mt-3">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isLiked
              ? "text-red-500"
              : "text-neutral-500 hover:text-red-400"
          }`}
        >
          <Heart
            size={17}
            className={isLiked ? "fill-current" : ""}
          />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={toggleComments}
          className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            showComments ? "text-blue-400" : "text-neutral-500 hover:text-blue-400"
          }`}
        >
          <MessageSquare size={17} />
          <span>{commentsCount}</span>
        </button>

        <button
          onClick={handleRepost}
          disabled={isReposting}
          className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 ml-auto ${
            isReposted
              ? "text-green-500"
              : "text-neutral-500 hover:text-green-400"
          }`}
        >
          <Repeat2 size={17} />
          <span>{repostsCount}</span>
        </button>
      </div>

      {/* Comments Section — threaded feel */}
      {showComments && (
        <div className="mt-3 ml-2 border-l-2 border-neutral-800/60 pl-4">
          <CommentSection
            postId={post._id}
            postOwnerId={post.user?._id}
            onCommentAdded={handleCommentAdded}
            onCommentDeleted={handleCommentDeleted}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
