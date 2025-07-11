const asyncHandler = require("express-async-handler");
const { Quiz } = require("../models/quiz.model");
const { Submission, validateSubmission } = require("../models/submission.model");
const { User } = require("../models/user.model");

// Submit a quiz (store answers, calculate score, save submission)
exports.submitQuiz = asyncHandler(async (req, res) => {
  const { error } = validateSubmission(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  const { quizId, studentId, answers, timeTaken } = req.body;

  // Fetch quiz and questions
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  // Calculate score
  let score = 0;
  for (const q of quiz.questions) {
    const userAnswer = answers.find((a) => a.questionId == q._id.toString());
    if (!userAnswer) continue;
    if (q.type === "multiple-choice" || q.type === "short-answer") {
      if (String(userAnswer.answer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        score++;
      }
    } else if (q.type === "true-false") {
      if (String(userAnswer.answer) === String(q.correctAnswer)) {
        score++;
      }
    }
  }

  // Save submission
  const submission = new Submission({
    quizId,
    studentId,
    answers,
    score,
    timeTaken,
  });
  await submission.save();

  res.status(201).json({ success: true, submission });
});

// Get all submissions for a student
exports.getStudentResults = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  // Only allow the student or an admin to view
  if (!req.user || (req.user._id.toString() !== studentId && !req.user.isAdmin)) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
  const submissions = await Submission.find({ studentId }).populate('quizId');
  res.status(200).json({ success: true, submissions });
});

// Get all submissions for a quiz (teacher/admin)
exports.getQuizSubmissions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Only allow teachers (owner) or admin
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }
  if (!req.user || (quiz.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin)) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
  const submissions = await Submission.find({ quizId: id }).populate('studentId');
  res.status(200).json({ success: true, submissions });
}); 