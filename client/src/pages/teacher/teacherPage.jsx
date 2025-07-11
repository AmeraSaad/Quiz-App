import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useQuizzesStore } from "../../store/quizzesStore";
import QuizList from "./components/QuizList";
import QuizForm from "./components/QuizForm";

const TeacherPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { getMyQuizzes, quizzes, isLoading, error } = useQuizzesStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "teacher") {
      getMyQuizzes();
    }
  }, [isAuthenticated, user, getMyQuizzes]);

  if (!isAuthenticated || user?.role !== "teacher") {
    return (
      <div className="text-center text-red-600 mt-10">
        You must be a teacher to access this page.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">My Quizzes</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Close" : "Create Quiz"}
        </button>
      </div>
      {showForm && <QuizForm onClose={() => setShowForm(false)} />}
      <QuizList quizzes={quizzes} isLoading={isLoading} error={error} />
    </div>
  );
};

export default TeacherPage;
