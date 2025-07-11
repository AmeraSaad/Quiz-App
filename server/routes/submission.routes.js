const express = require("express");
const router = express.Router();
const { submitQuiz, getStudentResults, getQuizSubmissions } = require("../controllers/submission.controller");
const { verifyTokenAndUserCheck } = require("../middleware/verifyToken");

// All routes require authentication
router.use(verifyTokenAndUserCheck);

// Submit a quiz
router.post("/", submitQuiz);

// Student result history
router.get("/results/:studentId", getStudentResults);

// Teacher view of all submissions for a quiz
router.get("/quiz/:id", getQuizSubmissions);

module.exports = router; 