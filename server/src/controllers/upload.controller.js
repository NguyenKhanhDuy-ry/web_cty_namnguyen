const streamifier = require("streamifier");
const { cloudinary } = require("../config/cloudinary");

const uploadFromBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "nam-nguyen-tech" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn một tệp ảnh để tải lên" });
    }

    const result = await uploadFromBuffer(req.file);

    return res.status(201).json({
      success: true,
      message: "Tải ảnh lên thành công",
      data: { url: result.secure_url }
    });
  } catch (error) {
    next(error);
  }
};

const uploadMultipleImages = async (req, res, next) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];

    if (!files.length) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn ít nhất một tệp ảnh để tải lên" });
    }

    const uploadPromises = files.map((file) => uploadFromBuffer(file));
    const results = await Promise.all(uploadPromises);
    const uploadedUrls = results.map((result) => result.secure_url);

    return res.status(201).json({
      success: true,
      message: "Tải ảnh lên thành công",
      urls: uploadedUrls
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage, uploadMultipleImages };
