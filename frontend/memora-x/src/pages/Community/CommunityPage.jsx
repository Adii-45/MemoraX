import React, { useState, useEffect } from "react";
import CreatePost from "../../components/community/CreatePost";
import PostCard from "../../components/community/PostCard";
import communityService from "../../services/communityService";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'my', 'liked'

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await communityService.getPosts(filter);
      if (res.success) {
        setPosts(res.data);
      }
    } catch (err) {
      toast.error("Failed to load community posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filter]);

  const handlePostCreated = (newPost) => {
    if (filter === "all" || filter === "my") {
      setPosts([newPost, ...posts]);
    }
  };

  const getEmptyStateMessage = () => {
    switch (filter) {
      case "my":
        return "You haven't posted anything yet.";
      case "liked":
        return "You haven't liked any posts.";
      default:
        return "No posts yet. Be the first to share something!";
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Community Feed</h1>
        <p className="text-neutral-400">Join the discussion, share updates, and explore.</p>
      </div>

      <CreatePost onPostCreated={handlePostCreated} />

      {/* Filters */}
      <div className="flex bg-neutral-900 rounded-xl p-1 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            filter === "all" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("my")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            filter === "my" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          My Posts
        </button>
        <button
          onClick={() => setFilter("liked")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            filter === "liked" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Liked
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-12 text-center mt-4">
            <h3 className="text-lg font-medium text-neutral-300 mb-2">It's a bit quiet here</h3>
            <p className="text-neutral-500">{getEmptyStateMessage()}</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
