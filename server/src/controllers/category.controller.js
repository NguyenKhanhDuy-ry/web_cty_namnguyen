const { isValidObjectId } = require("mongoose");
const adminService = require("../services/admin.service");

const getCategories = async (req, res, next) => {
  try {
    const categories = await adminService.getCategories(req.query);

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.categoryId)) {
      return res.status(400).json({ success: false, message: "ID danh mục không hợp lệ" });
    }

    const category = await adminService.getCategoryById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await adminService.createCategory(req.body);

    return res.status(201).json({
      success: true,
      message: "Thêm danh mục thành công",
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.categoryId)) {
      return res.status(400).json({ success: false, message: "ID danh mục không hợp lệ" });
    }

    const category = await adminService.updateCategory(req.params.categoryId, req.body);

    return res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.categoryId)) {
      return res.status(400).json({ success: false, message: "ID danh mục không hợp lệ" });
    }

    await adminService.deleteCategory(req.params.categoryId);

    return res.status(200).json({ success: true, message: "Xóa danh mục thành công" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
