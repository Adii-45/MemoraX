/**
 * Migration: Set isReviewed on existing flashcards
 * 
 * For cards that have been reviewed (reviewCount > 0), set isReviewed = true.
 * For cards that haven't been reviewed (reviewCount === 0), set isReviewed = false.
 * 
 * Usage: node utils/migrateFlashcardReviewed.js
 * 
 * This is safe to run multiple times (idempotent).
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Flashcard from "../models/flashcardModel.js";

const migrate = async () => {
  try {
    await connectDB();
    console.log("Connected to database.");

    const flashcardSets = await Flashcard.find({});
    console.log(`Found ${flashcardSets.length} flashcard sets to process.`);

    let updatedSets = 0;
    let updatedCards = 0;

    for (const set of flashcardSets) {
      let modified = false;

      for (const card of set.cards) {
        const shouldBeReviewed = card.reviewCount > 0;

        if (card.isReviewed !== shouldBeReviewed) {
          card.isReviewed = shouldBeReviewed;
          modified = true;
          updatedCards++;
        }
      }

      if (modified) {
        await set.save();
        updatedSets++;
      }
    }

    console.log(`\nMigration complete:`);
    console.log(`  Sets updated: ${updatedSets}`);
    console.log(`  Cards updated: ${updatedCards}`);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
