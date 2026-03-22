import React, { useState, useEffect } from "react";
import { Plus, Trash2, Brain, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";

const FlashCardManager = ({ documentId }) => {
  const [flashcardsSets, setFlashcardsSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardsSets = async () => {
    setLoading(true);
    try {
      const res = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardsSets(res.data); // ✅ correct
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

  const handToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      const updatedSets = flashcardsSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) => {
            card._id === cardId ? { ...card, isStarred: !card.isStarred } : card;
            });
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
  }

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set); // ✅ FIXED
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Flashcard Sets ({flashcardsSets.length})
          </h3>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 h-10 rounded-xl"
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardsSets.map((set) => (
            <div
              key={set._id}
              onClick={() => setSelectedSet(set)}
              className="border p-4 rounded-xl cursor-pointer hover:shadow"
            >
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="float-right text-red-500"
              >
                <Trash2 size={16} />
              </button>

              <Brain className="mb-2" />

              <h4 className="font-semibold">Flashcard Set</h4>
              <p className="text-xs text-gray-500">
                {moment(set.createdAt).format("MMM D, YYYY")}
              </p>

              <p className="text-sm mt-2">{set.cards?.length || 0} cards</p>
            </div>
          ))}
        </div>
      </div>

      const renderFlashcardViewer = () => {
        const currentCard = selectedSet?.cards[currentCardIndex];

        return (
          <div className="space-y-8">
            {/* Back button */}
            <button
              onClick={() => setSelectedSet(null)}
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors duration-200"
            >
              <ArrowLeft
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
              strokeWidth={2}
              />
              Back to Sets
            </button>

            {/* {Flashcard Display} */}
            <div className="flex flex-col items-centerspace-y-8">
              <div className="w-full max-w-2xl">
                <Flashcard
                  flashcard={currentCard}
                  onToogleStar={handleToggleStar}
                />
              </div>

              {/* {Navigation Controls} */}
              <div className="flex items-center gap-6">
                <button
                  onClick={handlePreviousCard}
                  disabled={selectedSet?.cards.length === 1}
                  className="group flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-100"
                >
                  <ChevronLeft
                    className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
                    strokeWidth={2.5}
                  />
                  Previous
                </button>

                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-sm font-semibold text-slate-700">
                    {currentCardIndex + 1}{" "}
                    <span className="text-slate-400 font-normal">/</span>{""}
                    {selectedSet.cards.length}
                  </span>
                </div>

                <button
                  onClick={handleNextCard}
                  disabled={selectedSet.cards.length <= 1}
                  className="group flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-100"
                >
                  Next
                  <ChevronRight
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            </div>
          </div>
        );
      };

      {/*Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Set"
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this set?
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>

          <button
            onClick={handleConfirmDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FlashCardManager;
