import express from 'express';
import {
    getFlashcards,
    getAllFlashcardSets,
    reviewFlashcard,
    toggleStarFlashcard,
    deleteFlashcardSet,
} from '../controllers/flashcardController.js';
import protect from '../middleware/auth.js';
import { get } from 'mongoose';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getAllFlashcardSets);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashcard);
router.put('/:cardId/star', toggleStarFlashcard);
router.delete('/:setId', deleteFlashcardSet);

export default router;