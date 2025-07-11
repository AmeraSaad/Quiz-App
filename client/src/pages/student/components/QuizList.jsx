import React from 'react';

const QuizList = ({ quizzes, onSelectQuiz, submissions }) => {
  // Map quizId to submission for quick lookup
  const submissionMap = React.useMemo(() => {
    const map = {};
    if (submissions) {
      submissions.forEach((s) => {
        map[s.quizId] = s;
      });
    }
    return map;
  }, [submissions]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Quizzes</h1>
      <ul>
        {quizzes.map((quiz) => {
          const submission = submissionMap[quiz._id];
          return (
            <li key={quiz._id} className="mb-4 border-b pb-2">
              <div className="font-semibold text-lg">{quiz.title}</div>
              <div className="text-gray-600 mb-1">{quiz.description}</div>
              <div className="text-xs text-gray-500 mb-2">Duration: {quiz.duration} min</div>
              {submission && (
                <div className="text-green-700 font-semibold mb-1">Score: {submission.score} / {quiz.questions?.length || '-'}</div>
              )}
              <button
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => onSelectQuiz(quiz)}
              >
                Take Quiz
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default QuizList; 