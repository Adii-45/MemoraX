import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Trash2, Brain, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";

// ⚠️ REMOVED Modal import

import Flashcard from "./Flashcard";

const FlashCardManager = ({ documentId }) => {
  const [flashcardsSets, setFlashcardsSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const hasHandledGenerate = useRef(false);

  const fetchFlashcardsSets = async () => {
    setLoading(true);
    try {
      const res = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardsSets(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcardsSets();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Generated!");
      fetchFlashcardsSets();
    } catch {
      toast.error("Failed");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("generate") === "true" && documentId && !hasHandledGenerate.current) {
      if (params.get("tab") === "flashcards") {
        hasHandledGenerate.current = true;
        // Remove generate from URL to prevent infinite loops
        params.delete("generate");
        navigate({ search: params.toString() }, { replace: true });
        
        handleGenerateFlashcards();
      }
    }
  }, [documentId, location.search, navigate]);

  const handToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      const updatedSets = flashcardsSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) =>
            card._id === cardId
              ? { ...card, isStarred: !card.isStarred }
              : card
          );
          return { ...set, cards: updatedCards };
        }
        return set;
      });

      setFlashcardsSets(updatedSets);
      setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
      toast.success("Flashcard starred status updated");
    } catch (error) {
      toast.error("Failed to update star status");
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);

    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Deleted Successfully");
      fetchFlashcardsSets();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleNextCard = () => {
    if (!selectedSet) return;
    setCurrentCardIndex((prev) =>
      (prev + 1) % selectedSet.cards.length
    );
  };

  const handlePreviousCard = () => {
    if (!selectedSet) return;
    setCurrentCardIndex((prev) =>
      (prev - 1 + selectedSet.cards.length) %
      selectedSet.cards.length
    );
  };

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet?.cards[currentCardIndex];

    return (
      <div className="space-y-8">
        <button
          onClick={() => {
            setSelectedSet(null);
            setCurrentCardIndex(0);
          }}
          className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sets
        </button>

        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-2xl">
            <Flashcard
              flashcard={currentCard}
              onToogleStar={handToggleStar}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePreviousCard}
              className="px-4 py-2 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 rounded transition-colors"
            >
              Prev
            </button>

            <span>
              {currentCardIndex + 1} / {selectedSet.cards.length}
            </span>

            <button
              onClick={handleNextCard}
              className="px-4 py-2 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 rounded transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {selectedSet ? (
        renderFlashcardViewer()
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">
              Flashcard Sets ({flashcardsSets.length})
            </h3>

            <button
              onClick={handleGenerateFlashcards}
              disabled={generating}
              className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white px-4 h-10 rounded-xl transition-all"
            >
              {generating ? "Generating..." : "Generate More"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcardsSets.map((set) => (
              <div
                key={set._id}
                onClick={() => {
                  setSelectedSet(set);
                  setCurrentCardIndex(0);
                }}
                className="border border-neutral-800 p-4 rounded-xl cursor-pointer hover:bg-neutral-800/50 transition-colors"
              >
                <button
                  onClick={(e) => handleDeleteRequest(e, set)}
                  className="float-right text-red-500"
                >
                  <Trash2 size={16} />
                </button>

                <Brain className="mb-2 text-neutral-300" />

                <h4 className="font-semibold text-white">Flashcard Set</h4>
                <p className="text-xs text-neutral-500">
                  {moment(set.createdAt).format("MMM D, YYYY")}
                </p>
                <p className="text-sm mt-2 text-neutral-300">
                  {set.cards?.length || 0} cards
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ NEW DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            
            <h2 className="text-lg font-semibold text-white mb-2">
              Delete Flashcard Set
            </h2>
            <p className="text-sm text-neutral-500 mb-4">
              Are you sure you want to delete this set? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashCardManager;