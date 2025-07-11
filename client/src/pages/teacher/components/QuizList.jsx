import React, { useState } from "react";
import { useQuizzesStore } from "../../../store/quizzesStore";
import toast from "react-hot-toast";
import QuizForm from "./QuizForm";

const QuizDetails = ({ quiz }) => (
  <div className="mt-4 bg-blue-50 rounded p-4">
    <h3 className="font-semibold mb-2">Questions:</h3>
    <ol className="space-y-4 list-none">
      {quiz.questions.map((q, idx) => (
        <li key={idx} className="mb-2">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-bold text-blue-700">{idx + 1}.</span>
            <span className="font-medium text-blue-700">{q.text}</span>
            <span className="ml-2 text-xs text-gray-400">({q.type})</span>
          </div>
          {q.type === "multiple-choice" && (
            <ul className="ml-4 mb-1">
              {q.options.map((opt, oIdx) => (
                <li key={oIdx} className={q.correctAnswer === opt ? "text-green-600 font-semibold" : ""}>
                  {opt}
                  {q.correctAnswer === opt && <span className="ml-2 text-xs">(Correct)</span>}
                </li>
              ))}
            </ul>
          )}
          {q.type === "true-false" && (
            <div className="ml-4 mb-1">
              <span className={q.correctAnswer === "true" ? "text-green-600 font-semibold" : ""}>True</span>{" | "}
              <span className={q.correctAnswer === "false" ? "text-green-600 font-semibold" : ""}>False</span>
            </div>
          )}
          {q.type === "short-answer" && (
            <div className="ml-4 mb-1">
              <span className="text-green-600 font-semibold">Answer: {q.correctAnswer}</span>
            </div>
          )}
        </li>
      ))}
    </ol>
  </div>
);

const QuizList = ({ quizzes, isLoading, error }) => {
  const { deleteQuiz, isLoading: isDeleting } = useQuizzesStore();
  const [expandedQuizId, setExpandedQuizId] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(id);
        toast.success("Quiz deleted successfully");
      } catch (err) {
        toast.error(err.response?.data?.message || "Error deleting quiz");
      }
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
  };

  const handleCloseForm = () => {
    setEditingQuiz(null);
  };

  if (isLoading) return <div className="text-center py-8">Loading quizzes...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;
  if (!quizzes || quizzes.length === 0)
    return <div className="text-center text-gray-500 py-8">No quizzes found.</div>;

  return (
    <div className="space-y-4">
      {editingQuiz && (
        <QuizForm
          quiz={editingQuiz}
          mode="edit"
          onClose={handleCloseForm}
        />
      )}
      {quizzes.map((quiz) => {
        const expanded = expandedQuizId === quiz._id;
        return (
          <div
            key={quiz._id}
            className="bg-white shadow rounded p-4"
          >
            {/* Top row: Quiz name and buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-blue-700 flex-1">{quiz.title}</h2>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                  onClick={() => handleEdit(quiz)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm disabled:opacity-50"
                  onClick={() => handleDelete(quiz._id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
            {/* Second row: Duration and View details */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4">
              <span className="text-xs text-gray-400 block mb-1 md:mb-0">Duration: {quiz.duration} min</span>
              <span
                className="text-green-700 hover:underline text-sm cursor-pointer select-none md:ml-auto"
                onClick={() => setExpandedQuizId(expanded ? null : quiz._id)}
              >
                {expanded ? "Hide details" : "View details"}
              </span>
            </div>
            {/* Description always shown below name/duration */}
            <p className="text-gray-600 text-sm mt-2">{quiz.description}</p>
            {expanded && <QuizDetails quiz={quiz} />}
          </div>
        );
      })}
    </div>
  );
};

export default QuizList; 