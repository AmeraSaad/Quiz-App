import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const QuizForm = ({ quiz, onSubmit, isSubmitting, onBack }) => {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef();

  useEffect(() => {
    setTimeLeft(quiz.duration * 60);
    setAnswers({});
    setSubmitted(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, [quiz]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
    onSubmit(answers, quiz.duration * 60 - (timeLeft ?? 0));
  };

  const handleAutoSubmit = () => {
    if (!submitted) {
      toast('Time is up! Auto-submitting quiz.', { icon: '⏰' });
      handleSubmit();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">{quiz.title}</h2>
      {!submitted && (
        <div className="mb-4 text-lg font-semibold text-blue-700">
          Time Left: {formatTime(timeLeft)}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div key={q._id} className="mb-4">
            <div className="font-semibold mb-1">{idx + 1}. {q.text}</div>
            {q.type === 'multiple-choice' && (
              <div>
                {q.options.map((opt, oIdx) => (
                  <label key={oIdx} className="block">
                    <input
                      type="radio"
                      name={q._id}
                      value={opt}
                      checked={answers[q._id] === opt}
                      onChange={() => handleAnswerChange(q._id, opt)}
                      required
                      disabled={submitted}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
            {q.type === 'true-false' && (
              <div>
                <label>
                  <input
                    type="radio"
                    name={q._id}
                    value="true"
                    checked={answers[q._id] === 'true'}
                    onChange={() => handleAnswerChange(q._id, 'true')}
                    required
                    disabled={submitted}
                  />
                  True
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name={q._id}
                    value="false"
                    checked={answers[q._id] === 'false'}
                    onChange={() => handleAnswerChange(q._id, 'false')}
                    required
                    disabled={submitted}
                  />
                  False
                </label>
              </div>
            )}
            {q.type === 'short-answer' && (
              <input
                type="text"
                className="border rounded p-1 w-full"
                value={answers[q._id] || ''}
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                required
                disabled={submitted}
              />
            )}
          </div>
        ))}
        {!submitted && (
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </form>
      <button
        className="mt-4 underline text-blue-600"
        onClick={onBack}
        disabled={isSubmitting}
      >
        Back to quiz list
      </button>
    </div>
  );
};

export default QuizForm; 