import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// Get all flashcard sets
const getAllFlashcardSets = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS
    );
    return response.data;
  } catch (error) {
    console.error("GET ALL FLASHCARDS ERROR:", error);
    throw error.response?.data || { message: "Failed to fetch flashcard sets" };
  }
};

// Get flashcards for a specific document
const getFlashcardsForDocument = async (documentId) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId)
    );
    return response.data;
  } catch (error) {
    console.error("GET DOC FLASHCARDS ERROR:", error);
    throw error.response?.data || { message: "Failed to fetch flashcards" };
  }
};

// Review a flashcard
const reviewFlashcard = async (cardId, cardIndex) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId),
      { cardIndex }
    );
    return response.data;
  } catch (error) {
    console.error("REVIEW FLASHCARD ERROR:", error);
    throw error.response?.data || { message: "Failed to review flashcard" };
  }
};

// Toggle star
const toggleStar = async (cardId) => {
  try {
    const response = await axiosInstance.put(
      API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId)
    );
    return response.data;
  } catch (error) {
    console.error("TOGGLE STAR ERROR:", error);
    throw error.response?.data || { message: "Failed to star flashcard" };
  }
};

// Delete flashcard set
const deleteFlashcardSet = async (id) => {
  try {
    const response = await axiosInstance.delete(
      API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id)
    );
    return response.data;
  } catch (error) {
    console.error("DELETE FLASHCARD ERROR:", error);
    throw error.response?.data || { message: "Failed to delete flashcards" };
  }
};

const flashcardService = {
  getAllFlashcardSets,
  getFlashcardsForDocument,
  reviewFlashcard,
  toggleStar,
  deleteFlashcardSet,
};

export default flashcardService;