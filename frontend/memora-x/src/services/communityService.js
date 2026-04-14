import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const communityService = {
  // Create a new post
  createPost: async (formData) => {
    // We expect formData here (can contain an image file)
    const response = await axiosInstance.post(
      API_PATHS.COMMUNITY.CREATE_POST,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get posts with optional filter ('all', 'my', 'liked')
  getPosts: async (filter = "all") => {
    const response = await axiosInstance.get(API_PATHS.COMMUNITY.GET_POSTS, {
      params: { filter },
    });
    return response.data;
  },

  // Toggle like
  likePost: async (postId) => {
    const response = await axiosInstance.put(
      API_PATHS.COMMUNITY.LIKE_POST(postId)
    );
    return response.data;
  },

  // Add Comment
  createComment: async (postId, content, isAnonymous) => {
    const response = await axiosInstance.post(
      API_PATHS.COMMUNITY.CREATE_COMMENT(postId),
      { content, isAnonymous }
    );
    return response.data;
  },

  // Get Comments
  getComments: async (postId) => {
    const response = await axiosInstance.get(
      API_PATHS.COMMUNITY.GET_COMMENTS(postId)
    );
    return response.data;
  },

  // Repost
  repostPost: async (postId) => {
    const response = await axiosInstance.post(
      API_PATHS.COMMUNITY.REPOST(postId)
    );
    return response.data;
  },
};

export default communityService;
