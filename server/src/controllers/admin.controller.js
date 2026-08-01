const adminService = require("../services/admin.service");
const { isValidObjectId } = require("mongoose");

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await adminService.getDashboard();

    return res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getUsers();

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await adminService.createUser(req.body);

    return res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await adminService.updateUser(req.params.userId, req.body, req.user);

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await adminService.getProducts();

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await adminService.createProduct(req.body);

    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await adminService.updateProduct(req.params.productId, req.body);

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const result = await adminService.deleteProduct(req.params.productId);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await adminService.getCategories(req.query);
    return res.status(200).json({ success: true, data: categories });
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

const getOrders = async (req, res, next) => {
  try {
    const orders = await adminService.getOrders();

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await adminService.updateOrderStatus(req.params.orderId, req.body.status);

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const leads = await adminService.getLeads();

    return res.status(200).json({
      success: true,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

const updateLeadStatus = async (req, res, next) => {
  try {
    const lead = await adminService.updateLeadStatus(req.params.leadId, req.body.status);

    return res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getUsers,
  createUser,
  updateUser,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  updateOrderStatus,
  getLeads,
  updateLeadStatus
};
