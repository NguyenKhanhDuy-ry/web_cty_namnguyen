const express = require("express");
const categoryController = require("../controllers/category.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/:categoryId", categoryController.getCategoryById);

// Các thao tác chỉnh sửa chỉ admin được phép
router.post("/", requireAuth, requireRole("admin"), categoryController.createCategory);
router.put("/:categoryId", requireAuth, requireRole("admin"), categoryController.updateCategory);
router.delete("/:categoryId", requireAuth, requireRole("admin"), categoryController.deleteCategory);

module.exports = router;
