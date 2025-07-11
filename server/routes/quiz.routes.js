const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");
const {createQuiz, getMyQuizzes, getQuizById, updateQuiz, deleteQuiz} = require("../controllers/quiz.controller");
const { verifyTokenAndUserCheck } = require("../middleware/verifyToken");

// All routes require authentication
router.use(verifyTokenAndUserCheck);

// Create a new quiz
router.post("/", createQuiz);

// Get all quizzes created by the logged-in teacher
router.get("/my", getMyQuizzes);

// Get a single quiz by ID
router.get("/:id", getQuizById);

// Update a quiz
router.put("/:id", updateQuiz);

// Delete a quiz
router.delete("/:id", deleteQuiz);

module.exports = router; 