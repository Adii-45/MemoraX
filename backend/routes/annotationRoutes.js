import express from "express";
import {
  getAnnotations,
  saveAnnotations,
} from "../controllers/annotationController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/:documentId", getAnnotations);
router.put("/:documentId", saveAnnotations);

export default router;
