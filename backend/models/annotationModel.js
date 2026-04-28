import mongoose from "mongoose";

const lineSchema = new mongoose.Schema(
  {
    tool: {
      type: String,
      enum: ["pen", "highlighter"],
      required: true,
    },
    points: {
      type: [Number],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    strokeWidth: {
      type: Number,
      required: true,
    },
    opacity: {
      type: Number,
      default: 1,
    },
  },
  { _id: true }
);

const pageAnnotationSchema = new mongoose.Schema(
  {
    pageNumber: {
      type: Number,
      required: true,
    },
    lines: [lineSchema],
  },
  { _id: false }
);

const annotationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    pages: [pageAnnotationSchema],
  },
  {
    timestamps: true,
  }
);

// One annotation record per user per document
annotationSchema.index({ userId: 1, documentId: 1 }, { unique: true });

const Annotation = mongoose.model("Annotation", annotationSchema);

export default Annotation;
