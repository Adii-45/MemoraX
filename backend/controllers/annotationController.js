import Annotation from "../models/annotationModel.js";

// @desc    Get annotations for a document
// @route   GET /api/annotations/:documentId
// @access  Private
export const getAnnotations = async (req, res, next) => {
  try {
    const annotation = await Annotation.findOne({
      userId: req.user._id,
      documentId: req.params.documentId,
    });

    res.status(200).json({
      success: true,
      data: annotation ? annotation.pages : [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/update annotations for a document
// @route   PUT /api/annotations/:documentId
// @access  Private
export const saveAnnotations = async (req, res, next) => {
  try {
    const { pages } = req.body;

    if (!Array.isArray(pages)) {
      return res.status(400).json({
        success: false,
        error: "Pages must be an array",
        statusCode: 400,
      });
    }

    const annotation = await Annotation.findOneAndUpdate(
      {
        userId: req.user._id,
        documentId: req.params.documentId,
      },
      {
        userId: req.user._id,
        documentId: req.params.documentId,
        pages,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: annotation.pages,
      message: "Annotations saved successfully",
    });
  } catch (error) {
    next(error);
  }
};
