const express = require("express");
const productController = require("../controllers/product.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:productId", productController.getProductById);
router.post("/", requireAuth, requireRole("admin"), productController.createProduct);

module.exports = router;
