const express = require("express");
const leadController = require("../controllers/lead.controller");
const {
  requireAuth,
  requireRole
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), leadController.getLeads);
router.post("/", leadController.createLead);

module.exports = router;
