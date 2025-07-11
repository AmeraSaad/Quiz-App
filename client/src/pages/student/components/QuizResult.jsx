import React from 'react';

const QuizResult = ({ quiz, answers, score, onBack }) => (
  <div className="max-w-xl mx-auto p-4">
    <div className="text-green-600 font-bold mb-2">
      Your score: {score} / {quiz.questions.length}
    </div>
    <div>
      <h3 className="font-semibold mb-2">Review:</h3>
      {quiz.questions.map((q, idx) => {
        const studentAnswer = answers[q._id];
        const isCorrect =
          String(studentAnswer).trim().toLowerCase() ===
          String(q.correctAnswer).trim().toLowerCase();
        return (
          <div key={q._id} className="mb-3">
            <div>
              <span className="font-semibold">{idx + 1}. {q.text}</span>
            </div>
            <div>
              Your answer: {" "}
              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                {String(studentAnswer)}
              </span>
            </div>
            {!isCorrect && (
              <div>
                Correct answer: {" "}
                <span className="text-green-600">{String(q.correctAnswer)}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
    <button
      className="mt-4 underline text-blue-600"
      onClick={onBack}
    >
      Back to quiz list
    </button>
  </div>
);

export default QuizResult; 