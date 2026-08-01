const multer = require("multer");

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 20;

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
    cb(null, true);
  } else {
    const error = new Error("Định dạng ảnh không được hỗ trợ. Chỉ chấp nhận .jpg, .jpeg, .png và .webp");
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE, files: MAX_FILES },
  fileFilter: fileFilter
});

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: `Dung lượng ảnh không được vượt quá ${MAX_SIZE / 1024 / 1024}MB` });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ success: false, message: `Số lượng ảnh tải lên mỗi lần không được vượt quá ${MAX_FILES}` });
    }
  }

  if (err?.statusCode === 400) {
    return res.status(400).json({ success: false, message: err.message });
  }

  next(err);
};

module.exports = { upload, handleUploadError };