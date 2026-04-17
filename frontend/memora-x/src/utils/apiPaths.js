export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    PROFILE: "/api/auth/profile",
    GET_PROFILE: "/api/auth/profile",
    USER_PROFILE: (id) => `/api/auth/profile/${id}`,
    UPDATE_PROFILE: "/api/auth/profile",
    CHANGE_PASSWORD: "/api/auth/change-password",
    PROFILE_IMAGE: "/api/auth/profile-image",
  },

  DOCUMENTS: {
    UPLOAD: "/api/documents/upload",
    GET_DOCUMENTS: "/api/documents",
    GET_DOCUMENT_BY_ID: (id) => `/api/documents/${id}`,
    UPDATE_DOCUMENT: (id) => `/api/documents/${id}`,
    DELETE_DOCUMENT: (id) => `/api/documents/${id}`,
  },

  AI: {
    GENERATE_FLASHCARDS: "/api/ai/generate-flashcards",
    GENERATE_QUIZ: "/api/ai/generate-quiz",
    GENERATE_SUMMARY: "/api/ai/generate-summary",
    CHAT: "/api/ai/chat",
    EXPLAIN_CONCEPT: "/api/ai/explain-concept",
    GET_CHAT_HISTORY: (documentId) => `/api/ai/chat-history/${documentId}`,
  },

  FLASHCARDS: {
    GET_ALL_FLASHCARD_SETS: "/api/flashcards",
    GET_FLASHCARDS_FOR_DOC: (documentId) => `/api/flashcards/${documentId}`,
    REVIEW_FLASHCARD: (cardId) => `/api/flashcards/${cardId}/review`,
    TOGGLE_STAR: (cardId) => `/api/flashcards/${cardId}/star`,
    DELETE_FLASHCARD_SET: (id) => `/api/flashcards/${id}`,
  },

  QUIZZES: {
    GET_QUIZZES_FOR_DOC: (documentId) => `/api/quizzes/${documentId}`,
    GET_QUIZ_BY_ID: (id) => `/api/quizzes/quiz/${id}`,
    SUBMIT_QUIZ: (id) => `/api/quizzes/${id}/submit`,
    GET_QUIZ_RESULTS: (id) => `/api/quizzes/${id}/results`,
    DELETE_QUIZ: (id) => `/api/quizzes/${id}`,
  },

  PROGRESS: {
    GET_DASHBOARD: "/api/progress/dashboard",
  },
  COMMUNITY: {
    CREATE_POST: "/api/community/post",
    GET_POSTS: "/api/community/posts",
    LIKE_POST: (id) => `/api/community/post/${id}/like`,
    CREATE_COMMENT: (id) => `/api/community/post/${id}/comment`,
    GET_COMMENTS: (id) => `/api/community/post/${id}/comments`,
    REPOST: (id) => `/api/community/post/${id}/repost`,
    UPDATE_POST: (id) => `/api/community/post/${id}`,
    DELETE_POST: (id) => `/api/community/post/${id}`,
    UPDATE_COMMENT: (id) => `/api/community/comment/${id}`,
    DELETE_COMMENT: (id) => `/api/community/comment/${id}`,
    SHARE_POST: (shareId) => `/api/community/post/share/${shareId}`,
  },
  NOTIFICATIONS: {
    GET_RECENT: "/api/notifications",
    GET_ALL: "/api/notifications/all",
    UNREAD_COUNT: "/api/notifications/unread-count",
    MARK_READ: (id) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: "/api/notifications/read-all",
    GET_SETTINGS: "/api/notifications/settings",
    UPDATE_SETTINGS: "/api/notifications/settings",
  },
};
