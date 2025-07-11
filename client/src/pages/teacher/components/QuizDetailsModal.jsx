import React from "react";

const QuizDetailsModal = ({ quiz, onClose }) => {
  if (!quiz) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-blue-700 mb-2">{quiz.title}</h2>
        <p className="text-gray-600 mb-2">{quiz.description}</p>
        <div className="mb-4 text-sm text-gray-500">Duration: {quiz.duration} min</div>
        <div>
          <h3 className="font-semibold mb-2">Questions:</h3>
          <ol className="space-y-4 list-decimal list-inside">
            {quiz.questions.map((q, idx) => (
              <li key={idx} className="bg-blue-50 rounded p-3">
                <div className="mb-1">
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
                    <span className="ml-2 text-xs">(Correct: {q.correctAnswer})</span>
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
      </div>
    </div>
  );
};

export default QuizDetailsModal; 