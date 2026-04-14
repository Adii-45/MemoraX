import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images for the "image" field
  if (file.fieldname === "image") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for the image field"), false);
    }
  }
  // Allow images, PDFs, and DOC/DOCX for the "file" field
  else if (file.fieldname === "file") {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images, PDF, and DOC/DOCX files are allowed"), false);
    }
  }
  // Default: allow any other fields (profile image, etc.)
  else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
  },
  fileFilter,
});

export default upload;