import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(
        documentId
      );

      setFlashcardSets(response.data[0]);
      setFlashcards(response.data[0]?.cards || []);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);


  // Generate flashcards
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  // Navigation
  const handleNextCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) =>
        (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  // Review card
  const handleReview = async (index) => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id,index);
      toast.success("Flashcard reviewed!");
    } catch (error) {
      toast.error("Failed to review flashcard.");
    }
  };

  // Toggle star
  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);

      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) =>
          card._id === cardId
            ? { ...card, isStarred: !card.isStarred }
            : card
        )
      );

      toast.success("Flashcard starred status updated!");
    } catch (error) {
      toast.error("Failed to update star status.");
    }
  };

  // Delete set
  const handleDeleteFlashcardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(
        flashcardSets._id
      );
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error(
        error.message || "Failed to delete flashcard set."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Render content
  const renderFlashcardContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (flashcards.length === 0) {
      return (
        <EmptyState
          title="No Flashcards Yet"
          description="Generate flashcards from your document to start learning."
        />
      );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-xl">
          <Flashcard
            flashcard={currentCard}
            onToggleStar={handleToggleStar}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrevCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft size={16} /> Previous
          </Button>

          <span>
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button
            onClick={handleNextCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

return (
  <div>
    <div className="">
      <Link
        to={`/documents/${documentId}`}
        className=""
      >
        <ArrowLeft size={16} />
        Back to Document
      </Link>
    </div>

    <PageHeader title="Flashcards">
      <div className="">
        {!loading &&
          flashcards.length > 0 && (
            <>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={deleting}
            >
              <Trash2 size={16} /> Delete Set
            </Button>
            </>
          ) : (
            <Button onClick={handleGenerateFlashcards} disabled={generating}>
             {generating ? (
              <Spinner />
            ) : (
              <>
              <Plus size={16} /> Generate Flashcards
             </>
            )}
           </Button>
          ))}
      </div>
    </PageHeader>


      {renderFlashcardContent()}

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <div className="p-4">
          <p className="text-lg font-semibold mb-4">
            Are you sure you want to delete the flashcard set.
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteFlashcardSet}
              disabled={deleting}
              className=""
              >
              {deleting ? "Deleting..." : "Delete"}
              </Button>
          </div>
        </div>
      </Modal>
    </div>
    )
  }

export default FlashcardPage;