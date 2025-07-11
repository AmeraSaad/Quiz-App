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