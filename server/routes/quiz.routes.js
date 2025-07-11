const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");
const {createQuiz, getMyQuizzes, getQuizById, updateQuiz, deleteQuiz, getAvailableQuizzes} = require("../controllers/quiz.controller");
const { verifyTokenAndUserCheck } = require("../middleware/verifyToken");
const { submitQuiz } = require("../controllers/submission.controller");

// All routes require authentication
router.use(verifyTokenAndUserCheck);

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz (Teacher only)
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 example: "JavaScript Fundamentals"
 *               description:
 *                 type: string
 *                 example: "Test your knowledge of JavaScript basics"
 *               duration:
 *                 type: number
 *                 minimum: 1
 *                 example: 30
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - text
 *                     - type
 *                     - correctAnswer
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "What is JavaScript?"
 *                     type:
 *                       type: string
 *                       enum: [multiple-choice, true-false, short-answer]
 *                       example: "multiple-choice"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Programming language", "Markup language", "Style sheet"]
 *                     correctAnswer:
 *                       type: string
 *                       example: "Programming language"
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 quiz:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Teacher access required
 */
router.post("/", createQuiz);

/**
 * @swagger
 * /api/quizzes/my:
 *   get:
 *     summary: Get all quizzes created by the logged-in teacher
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teacher's quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 quizzes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       duration:
 *                         type: number
 *                       questions:
 *                         type: array
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Teacher access required
 */
router.get("/my", getMyQuizzes);

/**
 * @swagger
 * /api/quizzes/available:
 *   get:
 *     summary: Get all available quizzes for students
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 quizzes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       duration:
 *                         type: number
 *                       questions:
 *                         type: array
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Not authorized
 */
router.get("/available", getAvailableQuizzes);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get a single quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Quiz details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 quiz:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     duration:
 *                       type: number
 *                     questions:
 *                       type: array
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Quiz not found
 */
router.get("/:id", getQuizById);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     summary: Update a quiz (Teacher only)
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated JavaScript Fundamentals"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               duration:
 *                 type: number
 *                 minimum: 1
 *                 example: 45
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [multiple-choice, true-false, short-answer]
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctAnswer:
 *                       type: string
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 quiz:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Teacher access required
 *       404:
 *         description: Quiz not found
 */
router.put("/:id", updateQuiz);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz (Teacher only)
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Teacher access required
 *       404:
 *         description: Quiz not found
 */
router.delete("/:id", deleteQuiz);

module.exports = router; 