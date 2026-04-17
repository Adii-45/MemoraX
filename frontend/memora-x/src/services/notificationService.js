import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const notificationService = {
  getRecent: async () => {
    const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_RECENT);
    return response.data;
  },

  getAll: async (page = 1) => {
    const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_ALL, {
      params: { page },
    });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.UNREAD_COUNT);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axiosInstance.patch(
      API_PATHS.NOTIFICATIONS.MARK_READ(id)
    );
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.patch(
      API_PATHS.NOTIFICATIONS.MARK_ALL_READ
    );
    return response.data;
  },

  getSettings: async () => {
    const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_SETTINGS);
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await axiosInstance.patch(
      API_PATHS.NOTIFICATIONS.UPDATE_SETTINGS,
      settings
    );
    return response.data;
  },
};

export default notificationService;
