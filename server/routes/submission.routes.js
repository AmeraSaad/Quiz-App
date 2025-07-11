const express = require("express");
const router = express.Router();
const { submitQuiz } = require("../controllers/submission.controller");
const { verifyTokenAndUserCheck } = require("../middleware/verifyToken");

// All routes require authentication
router.use(verifyTokenAndUserCheck);

// Submit a quiz
router.post("/", submitQuiz);

module.exports = router; 