import express from "express";
import {
    getDashboard,
} from "../controllers/progressController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/dashboard", protect, getDashboard);

export default router;