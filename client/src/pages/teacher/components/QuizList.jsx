import React from "react";

const QuizList = ({ quizzes, isLoading, error }) => {
  if (isLoading) return <div className="text-center py-8">Loading quizzes...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;
  if (!quizzes || quizzes.length === 0)
    return <div className="text-center text-gray-500 py-8">No quizzes found.</div>;

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <div
          key={quiz._id}
          className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold text-blue-700">{quiz.title}</h2>
            <p className="text-gray-600 text-sm mb-1">{quiz.description}</p>
            <span className="text-xs text-gray-400">Duration: {quiz.duration} min</span>
          </div>
          <div className="mt-2 md:mt-0 flex gap-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">Edit</button>
            <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizList; 