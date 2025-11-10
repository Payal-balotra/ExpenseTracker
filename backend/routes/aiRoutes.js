  const express = require("express");
  const {
    categorizeExpense,
    getSmartInsights,
    generateMonthlyReport,
    chatWithAI,
    checkAIService,
  } = require("../controllers/aiController");
  const { protect } = require("../middlewares/authMiddleware");

  const router = express.Router();

  router.get("/status", protect, checkAIService);
  router.post("/categorize", protect, categorizeExpense);
  router.get("/insights", protect, getSmartInsights);
  router.get("/report", protect, generateMonthlyReport);
  router.post("/chat", protect, chatWithAI);

  module.exports = router;

