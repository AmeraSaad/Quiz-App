import React from 'react';

const QuizList = ({ quizzes, onSelectQuiz }) => (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Available Quizzes</h1>
    <ul>
      {quizzes.map((quiz) => (
        <li key={quiz._id} className="mb-4 border-b pb-2">
          <div className="font-semibold">{quiz.title}</div>
          <div className="text-gray-600">{quiz.description}</div>
          <button
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => onSelectQuiz(quiz)}
          >
            Take Quiz
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default QuizList; 