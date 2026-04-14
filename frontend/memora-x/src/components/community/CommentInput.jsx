import React, { useState } from "react";
import toast from "react-hot-toast";

const CommentInput = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit(content, isAnonymous);
    setContent(""); // Clear input on submit parent will handle loading state
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-neutral-900/60 border border-neutral-800/50 rounded-md px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
        />
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          className="text-xs font-medium text-white bg-primary hover:bg-primary-dark px-3 py-1.5 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          {isLoading ? "..." : "Post"}
        </button>
      </div>
      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-neutral-500 hover:text-neutral-400 transition-colors ml-0.5">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          disabled={isLoading}
          className="rounded border-neutral-700/50 bg-neutral-900/40 text-primary focus:ring-primary/30 focus:ring-offset-0 w-3 h-3"
        />
        Anonymous
      </label>
    </form>
  );
};

export default CommentInput;
