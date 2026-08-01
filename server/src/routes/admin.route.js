const express = require("express");
const {
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
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.post("/users", createUser);
router.patch("/users/:userId", updateUser);
router.get("/products", getProducts);
router.post("/products", createProduct);
router.patch("/products/:productId", updateProduct);
router.delete("/products/:productId", deleteProduct);
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.patch("/categories/:categoryId", updateCategory);
router.delete("/categories/:categoryId", deleteCategory);
router.get("/orders", getOrders);
router.patch("/orders/:orderId", updateOrderStatus);
router.get("/leads", getLeads);
router.patch("/leads/:leadId", updateLeadStatus);

module.exports = router;