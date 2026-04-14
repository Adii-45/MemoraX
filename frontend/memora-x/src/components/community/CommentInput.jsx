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
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <input
        type="text"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-400">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            disabled={isLoading}
            className="rounded border-neutral-700 bg-neutral-900 text-primary focus:ring-primary focus:ring-offset-neutral-950"
          />
          Comment as Anonymous
        </label>
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          className="text-sm font-medium text-white bg-primary hover:bg-primary-dark px-4 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CommentInput;
