const express = require("express");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const { uploadImage, uploadMultipleImages } = require("../controllers/upload.controller");
const { upload, handleUploadError } = require("../services/upload.middleware");

const router = express.Router();

const uploadSingleMiddleware = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return handleUploadError(error, req, res, next);
    }

    return next();
  });
};

const uploadMultipleMiddleware = (req, res, next) => {
  upload.array("images", 20)(req, res, (error) => {
    if (error) {
      return handleUploadError(error, req, res, next);
    }

    return next();
  });
};

router.post("/", requireAuth, requireRole("admin"), uploadMultipleMiddleware, uploadMultipleImages);
router.post("/image", requireAuth, requireRole("admin"), uploadSingleMiddleware, uploadImage);

module.exports = router;
