const asyncHandler = require("express-async-handler");
const { Quiz, validateQuiz } = require("../models/quiz.model");

/**
 * @desc    Create a new quiz (teacher only)
 * @route   POST /api/v1/quizzes
 * @access  Teacher
 */
exports.createQuiz = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    return res.status(403).json({ success: false, message: "Only teachers can create quizzes" });
  }
  const { error } = validateQuiz({ ...req.body, createdBy: req.user._id });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  const quiz = new Quiz({ ...req.body, createdBy: req.user._id });
  await quiz.save();
  res.status(201).json({ success: true, quiz });
});

/**
 * @desc    Get all quizzes created by the logged-in teacher
 * @route   GET /api/v1/quizzes/my
 * @access  Teacher
 */
exports.getMyQuizzes = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    return res.status(403).json({ success: false, message: "Only teachers can view their quizzes" });
  }
  const quizzes = await Quiz.find({ createdBy: req.user._id });
  res.status(200).json({ success: true, quizzes });
});

/**
 * @desc    Get a single quiz by ID
 * @route   GET /api/v1/quizzes/:id
 * @access  Teacher (owner) or Admin
 */
exports.getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }
  // Only allow owner or admin
  if (
    !req.user ||
    (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin")
  ) {
    return res.status(403).json({ success: false, message: "Not authorized to view this quiz" });
  }
  res.status(200).json({ success: true, quiz });
});

/**
 * @desc    Update a quiz (teacher only, must be owner)
 * @route   PUT /api/v1/quizzes/:id
 * @access  Teacher (owner)
 */
exports.updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }
  if (!req.user || quiz.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to update this quiz" });
  }
  const { error } = validateQuiz({ ...req.body, createdBy: req.user._id });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  Object.assign(quiz, req.body);
  await quiz.save();
  res.status(200).json({ success: true, quiz });
});

/**
 * @desc    Delete a quiz (teacher only, must be owner)
 * @route   DELETE /api/v1/quizzes/:id
 * @access  Teacher (owner)
 */
exports.deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }
  if (!req.user || quiz.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to delete this quiz" });
  }
  await quiz.deleteOne();
  res.status(200).json({ success: true, message: "Quiz deleted" });
});

/**
 * @desc    Get all available quizzes for students
 * @route   GET /api/v1/quizzes/available
 * @access  Student
 */
exports.getAvailableQuizzes = asyncHandler(async (req, res) => {
  // For now, return all quizzes. You can add filters (e.g., published, not owned by student) as needed.
  const quizzes = await Quiz.find({});
  res.status(200).json({ success: true, quizzes });
}); 