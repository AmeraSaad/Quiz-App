const express = require("express");
const router = express.Router();
const { submitQuiz, getStudentResults, getQuizSubmissions } = require("../controllers/submission.controller");
const { verifyTokenAndUserCheck } = require("../middleware/verifyToken");

// All routes require authentication
router.use(verifyTokenAndUserCheck);

/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Submit a quiz (Student only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quizId
 *               - answers
 *             properties:
 *               quizId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               studentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - answer
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439013"
 *                     answer:
 *                       type: string
 *                       example: "Programming language"
 *               timeTaken:
 *                 type: number
 *                 description: Time taken in seconds
 *                 example: 1800
 *     responses:
 *       201:
 *         description: Quiz submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 submission:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     quizId:
 *                       type: string
 *                     studentId:
 *                       type: string
 *                     score:
 *                       type: number
 *                     answers:
 *                       type: array
 *                     timeTaken:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error or quiz not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Student access required
 */
router.post("/", submitQuiz);

/**
 * @swagger
 * /api/submissions/results/{studentId}:
 *   get:
 *     summary: Get all submissions for a student (Admin/Student)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *         example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: List of student's submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 submissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       quizId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                       score:
 *                       type: number
 *                       answers:
 *                         type: array
 *                       timeTaken:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
router.get("/results/:studentId", getStudentResults);

/**
 * @swagger
 * /api/submissions/quiz/{id}:
 *   get:
 *     summary: Get all submissions for a quiz (Teacher only)
 *     tags: [Submissions]
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
 *         description: List of quiz submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 submissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       studentId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *                       score:
 *                         type: number
 *                       answers:
 *                         type: array
 *                       timeTaken:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Teacher access required
 *       404:
 *         description: Quiz not found
 */
router.get("/quiz/:id", getQuizSubmissions);

module.exports = router; 