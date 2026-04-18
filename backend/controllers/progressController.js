import Document from "../models/documentModel.js";
import Quiz from "../models/quizModel.js";
import Flashcard from "../models/flashcardModel.js";

// Helper to format date "MMM DD"
const formatDate = (date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
};

// Helper to format date "ddd"
const formatDay = (date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

// @desc    Get user learning statistics
// @route   GET /api/progress/dashboard
// @access  Private
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { range = '30d' } = req.query;

    // Get basic stats
    const totalDocuments = await Document.countDocuments({ userId });
    const flashcardSets = await Flashcard.find({ userId });
    const totalFlashcards = flashcardSets.reduce((sum, set) => sum + set.cards.length, 0);
    const totalQuizzes = await Quiz.countDocuments({ userId });

    const completedQuizzes = await Quiz.find({ userId, completedAt: { $ne: null } }).sort({ completedAt: -1 });
    const averageScore = completedQuizzes.length > 0
        ? Math.round(completedQuizzes.reduce((sum, q) => sum + q.score, 0) / completedQuizzes.length)
        : 0;

    // === Study Activity (Dynamic Date Range) ===
    let days = 30;
    if (range === '7d') days = 7;
    else if (range === '90d') days = 90;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (days - 1));
    targetDate.setHours(0, 0, 0, 0);

    const recentDocs = await Document.find({ userId, uploadDate: { $gte: targetDate } });
    const recentQuizzesCreated = await Quiz.find({ userId, createdAt: { $gte: targetDate } });
    const recentFlashcardSets = await Flashcard.find({ userId, createdAt: { $gte: targetDate } });

    const activityMap = {};
    for (let i = 0; i < days; i++) {
        const d = new Date(targetDate);
        d.setDate(d.getDate() + i);
        activityMap[formatDate(d)] = { uploads: 0, flashcards: 0, quizzes: 0 };
    }

    recentDocs.forEach(doc => {
        const dateStr = formatDate(new Date(doc.uploadDate));
        if (activityMap[dateStr]) activityMap[dateStr].uploads += 1;
    });
    recentQuizzesCreated.forEach(quiz => {
        const dateStr = formatDate(new Date(quiz.createdAt));
        if (activityMap[dateStr]) activityMap[dateStr].quizzes += 1;
    });
    recentFlashcardSets.forEach(set => {
        const dateStr = formatDate(new Date(set.createdAt));
        if (activityMap[dateStr]) activityMap[dateStr].flashcards += set.cards.length;
    });

    const studyActivity = Object.keys(activityMap).map(date => ({
        date,
        ...activityMap[date]
    }));

    // === Quiz Performance ===
    // Last 10 attempts sorted by date ascending (oldest on left to newest on right)
    const last10Quizzes = completedQuizzes.slice(0, 10).reverse();
    const quizPerformance = last10Quizzes.map((q, index) => ({
      attempt: q.title || `Quiz ${index + 1}`,
      score: q.score,
      completedAt: q.completedAt,
      subject: "Quiz", 
    }));

    // === Flashcard Stats ===
    let reviewedCards = 0;
    let notReviewedCards = 0;
    
    flashcardSets.forEach(set => {
        set.cards.forEach(card => {
            // Use isReviewed if present, fall back to reviewCount for old cards
            const wasReviewed = card.isReviewed === true || card.reviewCount > 0;
            if (wasReviewed) reviewedCards++;
            else notReviewedCards++;
        });
    });

    // === Weekly Consistency ===
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyMap = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        weeklyMap[formatDay(d)] = 0;
    }

    const sessionsSevenDocs = await Document.find({ userId, uploadDate: { $gte: sevenDaysAgo } });
    const sessionsSevenQuizzes = await Quiz.find({ userId, completedAt: { $gte: sevenDaysAgo } });
    
    sessionsSevenDocs.forEach(doc => {
        const dayStr = formatDay(new Date(doc.uploadDate));
        if (weeklyMap[dayStr] !== undefined) weeklyMap[dayStr] += 1;
    });
    sessionsSevenQuizzes.forEach(quiz => {
        const dayStr = formatDay(new Date(quiz.completedAt));
        if (weeklyMap[dayStr] !== undefined) weeklyMap[dayStr] += 1;
    });

    const weeklyConsistency = Object.keys(weeklyMap).map(day => ({
        day,
        sessions: weeklyMap[day]
    }));

    // === Feature Usage ===
    const featureUsage = [
      { feature: "Documents", count: totalDocuments },
      { feature: "Flashcards", count: totalFlashcards },
      { feature: "Quizzes", count: totalQuizzes },
    ];

    // === Recent Activity (Keep existing logic) ===
    const recentActivityDocuments = await Document.find({ userId })
      .sort({ lastAccessed: -1 })
      .limit(5)
      .select("title fileName lastAccessed status");

    const recentActivityQuizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("documentId", "title")
      .select("title score totalQuestions completedAt");

    res.status(200).json({
      success: true,
      data: {
        totalDocuments,
        totalFlashcards,
        totalQuizzes,
        averageScore,
        studyActivity,
        quizPerformance,
        flashcardStats: {
          totalCards: totalFlashcards,
          reviewedCards,
          notReviewedCards,
          // Backward-compatible fields
          mastered: reviewedCards,
          learning: 0,
          notStarted: notReviewedCards,
        },
        weeklyConsistency,
        featureUsage,
        recentActivity: {
          documents: recentActivityDocuments,
          quizzes: recentActivityQuizzes
        }
      },
    });
  } catch (error) {
    next(error);
  }
};