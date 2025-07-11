const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");
const { verifyTokenAndUserCheck } = require("../middleware/verifyToken");

// All routes require authentication
router.use(verifyTokenAndUserCheck);

// Create a new quiz
router.post("/", quizController.createQuiz);

// Get all quizzes created by the logged-in teacher
router.get("/my", quizController.getMyQuizzes);

// Get a single quiz by ID
router.get("/:id", quizController.getQuizById);

// Update a quiz
router.put("/:id", quizController.updateQuiz);

// Delete a quiz
router.delete("/:id", quizController.deleteQuiz);

module.exports = router; 