const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");
const {createQuiz, getMyQuizzes, getQuizById, updateQuiz, deleteQuiz, getAvailableQuizzes} = require("../controllers/quiz.controller");
const { verifyTokenAndUserCheck } = require("../middleware/verifyToken");
const { submitQuiz } = require("../controllers/submission.controller");

// All routes require authentication
router.use(verifyTokenAndUserCheck);

// Create a new quiz
router.post("/", createQuiz);

// Get all quizzes created by the logged-in teacher
router.get("/my", getMyQuizzes);

// Get all available quizzes for students
router.get("/available", getAvailableQuizzes);

// Get a single quiz by ID
router.get("/:id", getQuizById);

// Update a quiz
router.put("/:id", updateQuiz);

// Delete a quiz
router.delete("/:id", deleteQuiz);

module.exports = router; 