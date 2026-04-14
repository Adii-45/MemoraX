import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  User,
  Heart,
  MessageSquare,
  Repeat2,
  FileText,
  Download,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import communityService from "../../services/communityService";
import { timeAgo } from "../../utils/timeAgo";
import ImageModal from "../../components/community/ImageModal";

const SharePostPage = () => {
  const { shareId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageModal, setImageModal] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await communityService.getSharedPost(shareId);
        if (res.success) {
          setPost(res.data);
        }
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "This post doesn't exist or has been removed."
            : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [shareId]);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-3">Post not found</h2>
          <p className="text-neutral-400 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to MemoraX
        </Link>

        {/* Post Card (read-only) */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
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
            <div>
              <h3 className="font-semibold text-neutral-200">
                {post.user?.username || "Unknown User"}
              </h3>
              <p className="text-xs text-neutral-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            {post.content && (
              <p className="text-neutral-300 whitespace-pre-wrap">{post.content}</p>
            )}

            {post.image && (
              <div className="flex justify-center items-center">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full max-h-[500px] object-contain rounded-xl bg-black border border-neutral-800 shadow-md cursor-pointer hover:brightness-110 transition-all"
                  onClick={() => setImageModal(post.image)}
                />
              </div>
            )}

            {post.file && (
              <div className="flex items-center gap-3 bg-neutral-900/60 border border-neutral-800/50 rounded-xl px-4 py-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200 truncate">
                    {post.fileName || "Attached file"}
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

          {/* Stats (read-only) */}
          <div className="flex items-center gap-6 pt-3 border-t border-neutral-800/40 mt-3">
            <div className="flex items-center gap-1.5 text-sm text-neutral-500">
              <Heart size={17} />
              <span>{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-neutral-500">
              <MessageSquare size={17} />
              <span>{post.comments?.length || post.commentsCount || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-neutral-500 ml-auto">
              <Repeat2 size={17} />
              <span>{post.reposts || 0}</span>
            </div>
          </div>

          {/* Comments (read-only) */}
          {post.comments && post.comments.length > 0 && (
            <div className="mt-3 ml-2 border-l-2 border-neutral-800/60 pl-4 pt-3">
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-2.5">
                    <div className="flex-shrink-0 pt-0.5">
                      {comment.isAnonymous || !comment.user?.profileImage ? (
                        <div className="w-7 h-7 rounded-full bg-neutral-800/60 flex items-center justify-center">
                          <User size={14} className="text-neutral-500" />
                        </div>
                      ) : (
                        <img
                          src={comment.user.profileImage}
                          alt="avatar"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-neutral-900/40 rounded-md px-3 py-2">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-neutral-300">
                            {comment.isAnonymous
                              ? "Anonymous User"
                              : comment.user?.username || "Unknown"}
                          </span>
                          <span className="text-[11px] text-neutral-600">
                            {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 whitespace-pre-wrap leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sign up CTA */}
        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm mb-3">
            Want to join the conversation?
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            Join MemoraX
          </Link>
        </div>
      </div>

      {/* Image Modal */}
      {imageModal && (
        <ImageModal
          src={imageModal}
          alt="Post image"
          onClose={() => setImageModal(null)}
        />
      )}
    </div>
  );
};

export default SharePostPage;
