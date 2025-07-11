import React, { useEffect, useState } from 'react';
import { useQuizzesStore } from '../../store/quizzesStore';
import { useSubmissionStore } from '../../store/submissionStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import QuizList from './components/QuizList';
import QuizForm from './components/QuizForm';
import QuizResult from './components/QuizResult';

const StudentPage = () => {
  const { getAvailableQuizzes, quizzes, isLoading, error } = useQuizzesStore();
  const { submitQuiz, getMySubmissions, submissions, isLoading: isSubmitting } = useSubmissionStore();
  const { user } = useAuthStore();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Track which quizzes have been submitted
  const submittedQuizIds = new Set(submissions.map((s) => s.quizId));

  useEffect(() => {
    getAvailableQuizzes();
    getMySubmissions();
    // eslint-disable-next-line
  }, []);

  const handleSelectQuiz = (quiz) => {
    if (submittedQuizIds.has(quiz._id)) {
      toast.error("You have already submitted this quiz.");
      return;
    }
    setSelectedQuiz(quiz);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setShowResult(false);
  };

  const handleQuizSubmit = async (answersObj, timeTaken) => {
    if (!selectedQuiz) return;
    if (!user || !user._id) {
      toast.error("You must be logged in as a student to submit a quiz.");
      return;
    }
    if (submittedQuizIds.has(selectedQuiz._id)) {
      toast.error("You have already submitted this quiz.");
      return;
    }
    const submissionData = {
      quizId: selectedQuiz._id,
      studentId: user._id,
      answers: selectedQuiz.questions.map((q) => ({
        questionId: q._id,
        answer: answersObj[q._id] || "",
      })),
      timeTaken,
    };
    try {
      const result = await submitQuiz(submissionData);
      setScore(result.score);
      setAnswers(answersObj);
      setSubmitted(true);
      setShowResult(true);
      toast.success("Quiz submitted!");
    } catch (err) {
      toast.error("Failed to submit quiz");
    }
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
    setShowResult(false);
    setSubmitted(false);
    setScore(null);
    setAnswers({});
  };

  if (isLoading) return <div>Loading quizzes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  if (selectedQuiz && showResult) {
    return (
      <QuizResult
        quiz={selectedQuiz}
        answers={answers}
        score={score}
        onBack={handleBackToList}
      />
    );
  }

  if (selectedQuiz) {
    return (
      <QuizForm
        quiz={selectedQuiz}
        onSubmit={handleQuizSubmit}
        isSubmitting={isSubmitting}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <QuizList quizzes={quizzes} onSelectQuiz={handleSelectQuiz} submissions={submissions} />
  );
};

export default StudentPage;
