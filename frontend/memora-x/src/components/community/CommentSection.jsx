import React, { useState, useEffect } from "react";
import { User, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import CommentInput from "./CommentInput";
import UserHoverCard from "./UserHoverCard";
import communityService from "../../services/communityService";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { timeAgo } from "../../utils/timeAgo";

const CommentSection = ({ postId, postOwnerId, onCommentAdded, onCommentDeleted }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await communityService.getComments(postId);
        if (res.success) {
          setComments(res.data);
        }
      } catch (err) {
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleCreateComment = async (content, isAnonymous) => {
    try {
      setSubmitting(true);
      const res = await communityService.createComment(postId, content, isAnonymous);
      if (res.success) {
        setComments([...comments, res.data]);
        if (onCommentAdded) onCommentAdded();
        toast.success("Comment added");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleEditSave = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      setSavingEdit(true);
      const res = await communityService.updateComment(commentId, editContent.trim());
      if (res.success) {
        setComments(
          comments.map((c) =>
            c._id === commentId ? { ...c, content: res.data.content } : c
          )
        );
        setEditingId(null);
        setEditContent("");
        toast.success("Comment updated");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update comment");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      setDeletingId(commentId);
      const res = await communityService.deleteComment(commentId);
      if (res.success) {
        setComments(comments.filter((c) => c._id !== commentId));
        if (onCommentDeleted) onCommentDeleted();
        toast.success("Comment deleted");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  // Check if the current user can edit a comment (must own the comment AND not anonymous)
  const canEdit = (comment) => {
    return !comment.isAnonymous && comment.user?._id === user?.id;
  };

  // Check if the current user can delete a comment (own comment or post owner)
  const canDelete = (comment) => {
    const isCommentOwner = !comment.isAnonymous && comment.user?._id === user?.id;
    const isPostOwner = postOwnerId === user?.id;
    return isCommentOwner || isPostOwner;
  };

  if (loading) {
    return <div className="py-3 text-center text-xs text-neutral-500">Loading comments...</div>;
  }

  return (
    <div className="pt-3">
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-center text-xs text-neutral-500 italic py-2">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`flex gap-2.5 group ${deletingId === comment._id ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="flex-shrink-0 pt-0.5">
                {comment.isAnonymous || !comment.user?.profileImage ? (
                  comment.isAnonymous ? (
                    <div className="w-7 h-7 rounded-full bg-neutral-800/60 flex items-center justify-center">
                      <User size={14} className="text-neutral-500" />
                    </div>
                  ) : (
                    <UserHoverCard userId={comment.user?._id}>
                      <div className="w-7 h-7 rounded-full bg-neutral-800/60 flex items-center justify-center hover:ring-2 hover:ring-primary/40 transition-all">
                        <User size={14} className="text-neutral-500" />
                      </div>
                    </UserHoverCard>
                  )
                ) : (
                  <UserHoverCard userId={comment.user?._id}>
                    <img
                      src={comment.user.profileImage}
                      alt="avatar"
                      className="w-7 h-7 rounded-full object-cover hover:ring-2 hover:ring-primary/40 transition-all"
                    />
                  </UserHoverCard>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-neutral-900/40 rounded-md px-3 py-2">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    {comment.isAnonymous ? (
                      <span className="text-xs font-semibold text-neutral-300">
                        Anonymous User
                      </span>
                    ) : (
                      <UserHoverCard userId={comment.user?._id}>
                        <span className="text-xs font-semibold text-neutral-300 hover:text-primary transition-colors cursor-pointer">
                          {comment.user?.username || "Unknown"}
                        </span>
                      </UserHoverCard>
                    )}
                    <span className="text-[11px] text-neutral-600">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>

                  {editingId === comment._id ? (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-neutral-800/60 border border-neutral-700/50 rounded-md px-2.5 py-1 text-xs text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleEditSave(comment._id);
                          }
                          if (e.key === "Escape") handleEditCancel();
                        }}
                      />
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={handleEditCancel}
                          disabled={savingEdit}
                          className="p-1 text-neutral-500 hover:text-neutral-300 rounded transition-colors"
                        >
                          <X size={14} />
                        </button>
                        <button
                          onClick={() => handleEditSave(comment._id)}
                          disabled={!editContent.trim() || savingEdit}
                          className="p-1 text-primary hover:text-primary-dark rounded disabled:opacity-50 transition-colors"
                        >
                          {savingEdit ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                  )}
                </div>

                {/* Comment actions — only visible on hover */}
                {editingId !== comment._id && (canEdit(comment) || canDelete(comment)) && (
                  <div className="flex items-center gap-2 mt-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canEdit(comment) && (
                      <button
                        onClick={() => handleEditStart(comment)}
                        className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                    )}
                    {canDelete(comment) && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="flex items-center gap-1 text-xs text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CommentInput onSubmit={handleCreateComment} isLoading={submitting} />
    </div>
  );
};

export default CommentSection;
