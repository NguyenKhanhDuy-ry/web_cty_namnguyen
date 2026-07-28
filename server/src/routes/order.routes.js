const express = require("express");
const orderController = require("../controllers/order.controller");
const { optionalAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", optionalAuth, orderController.createOrder);

module.exports = router;
