import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import CommentInput from "./CommentInput";
import communityService from "../../services/communityService";
import toast from "react-hot-toast";

const CommentSection = ({ postId, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  if (loading) {
    return <div className="p-4 text-center text-sm text-neutral-500">Loading comments...</div>;
  }

  return (
    <div className="pt-4 border-t border-neutral-800">
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-center text-sm text-neutral-500 italic py-2">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className="flex-shrink-0">
                {comment.isAnonymous || !comment.user?.profileImage ? (
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                    <User size={16} className="text-neutral-500" />
                  </div>
                ) : (
                  <img
                    src={comment.user.profileImage}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="bg-neutral-900 rounded-2xl rounded-tl-none px-4 py-2">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-neutral-200">
                      {comment.isAnonymous ? "Anonymous User" : comment.user?.username || "Unknown"}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 whitespace-pre-wrap">{comment.content}</p>
                </div>
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
