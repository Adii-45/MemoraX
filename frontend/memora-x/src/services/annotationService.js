import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getAnnotations = async (documentId) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.ANNOTATIONS.GET(documentId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch annotations" };
  }
};

const saveAnnotations = async (documentId, pages) => {
  try {
    const response = await axiosInstance.put(
      API_PATHS.ANNOTATIONS.SAVE(documentId),
      { pages }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to save annotations" };
  }
};

const annotationService = {
  getAnnotations,
  saveAnnotations,
};

export default annotationService;
