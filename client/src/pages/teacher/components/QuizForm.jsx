import React, { useState } from "react";
import { useQuizzesStore } from "../../../store/quizzesStore";

const defaultQuestion = {
  type: "multiple-choice",
  text: "",
  options: ["", ""],
  correctAnswer: "",
};

const QuizForm = ({ onClose }) => {
  const { createQuiz, isLoading, error } = useQuizzesStore();
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: 30,
    questions: [JSON.parse(JSON.stringify(defaultQuestion))],
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleQuestionChange = (idx, field, value) => {
    setForm((f) => {
      const questions = [...f.questions];
      if (field === "options") {
        questions[idx][field] = value;
      } else {
        questions[idx][field] = value;
      }
      return { ...f, questions };
    });
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    setForm((f) => {
      const questions = [...f.questions];
      questions[qIdx].options[oIdx] = value;
      return { ...f, questions };
    });
  };

  const addQuestion = () => {
    setForm((f) => ({
      ...f,
      questions: [...f.questions, JSON.parse(JSON.stringify(defaultQuestion))],
    }));
  };

  const removeQuestion = (idx) => {
    setForm((f) => ({
      ...f,
      questions: f.questions.filter((_, i) => i !== idx),
    }));
  };

  const addOption = (qIdx) => {
    setForm((f) => {
      const questions = [...f.questions];
      questions[qIdx].options.push("");
      return { ...f, questions };
    });
  };

  const removeOption = (qIdx, oIdx) => {
    setForm((f) => {
      const questions = [...f.questions];
      questions[qIdx].options.splice(oIdx, 1);
      return { ...f, questions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createQuiz(form);
      if (onClose) onClose();
    } catch (err) {
      setFormError(err.response?.data?.message || "Error creating quiz");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Create Quiz</h2>
      {formError && <div className="text-red-500 mb-2">{formError}</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Duration (minutes)</label>
        <input
          name="duration"
          type="number"
          min={1}
          value={form.duration}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Questions</label>
        {form.questions.map((q, idx) => (
          <div key={idx} className="mb-4 border rounded p-3 bg-blue-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-blue-700">
                Question {idx + 1}
              </span>
              {form.questions.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 hover:underline text-sm"
                  onClick={() => removeQuestion(idx)}
                >
                  Remove
                </button>
              )}
            </div>
            <div className="mb-2">
              <label className="block mb-1">Type</label>
              <select
                value={q.type}
                onChange={(e) =>
                  handleQuestionChange(idx, "type", e.target.value)
                }
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="short-answer">Short Answer</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Question Text</label>
              <input
                value={q.text}
                onChange={(e) =>
                  handleQuestionChange(idx, "text", e.target.value)
                }
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            {q.type === "multiple-choice" && (
              <div className="mb-2">
                <label className="block mb-1">Options</label>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center mb-1 gap-2">
                    <input
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(idx, oIdx, e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded p-2"
                      required
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        className="text-red-400 hover:underline text-xs"
                        onClick={() => removeOption(idx, oIdx)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="text-blue-500 hover:underline text-xs mt-1"
                  onClick={() => addOption(idx)}
                >
                  Add Option
                </button>
              </div>
            )}
            <div className="mb-2">
              <label className="block mb-1">Correct Answer</label>
              {q.type === "multiple-choice" ? (
                <input
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(idx, "correctAnswer", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              ) : q.type === "true-false" ? (
                <select
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(idx, "correctAnswer", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded p-2"
                  required
                >
                  <option value="">Select</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              ) : (
                <input
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(idx, "correctAnswer", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm"
          onClick={addQuestion}
        >
          Add Question
        </button>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Quiz"}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
