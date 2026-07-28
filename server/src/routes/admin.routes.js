const express = require("express");

const adminController = require("../controllers/admin.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", adminController.getDashboard);

router.get("/users", adminController.getUsers);
router.post("/users", adminController.createUser);
router.patch("/users/:userId", adminController.updateUser);

router.get("/products", adminController.getProducts);
router.post("/products", adminController.createProduct);
router.patch("/products/:productId", adminController.updateProduct);

router.get("/orders", adminController.getOrders);
router.patch("/orders/:orderId", adminController.updateOrderStatus);

router.get("/leads", adminController.getLeads);
router.patch("/leads/:leadId", adminController.updateLeadStatus);

module.exports = router;
