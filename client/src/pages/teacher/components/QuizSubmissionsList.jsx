import React, { useEffect } from "react";
import { useSubmissionStore } from "../../../store/submissionStore";

const QuizSubmissionsList = ({ quizId, onClose }) => {
  const { getQuizSubmissions, submissions, isLoading, error } = useSubmissionStore();

  useEffect(() => {
    if (quizId) getQuizSubmissions(quizId);
    // eslint-disable-next-line
  }, [quizId]);

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Quiz Submissions</h3>
        <button className="text-blue-600 underline" onClick={onClose}>Close</button>
      </div>
      {isLoading ? (
        <div>Loading submissions...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : submissions.length === 0 ? (
        <div>No submissions found for this quiz.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id} className="text-center">
                <td className="p-2 border">{sub.studentId?.username || "Student"}</td>
                <td className="p-2 border">{sub.score}</td>
                <td className="p-2 border">{new Date(sub.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuizSubmissionsList; 