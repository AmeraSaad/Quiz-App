import React, { useEffect, useState } from 'react';
import { useSubmissionStore } from '../store/submissionStore';
import { useAuthStore } from '../store/authStore';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { getStudentResults, submissions, isLoading, error } = useSubmissionStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user && user._id && user.role === 'student' && !loaded) {
      getStudentResults(user._id);
      setLoaded(true);
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="mb-8">
        <div className="font-semibold">Username: <span className="font-normal">{user?.username}</span></div>
        <div className="font-semibold">Email: <span className="font-normal">{user?.email}</span></div>
      </div>
      {user?.role === 'student' && (
        <>
          <h2 className="text-xl font-bold mb-4">Quiz Result History</h2>
          {isLoading ? (
            <div>Loading results...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : submissions.length === 0 ? (
            <div>No quiz submissions found.</div>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 border">Quiz Title</th>
                  <th className="p-2 border">Score</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((sub) => (
                    <tr key={sub._id} className="text-center">
                      <td className="p-2 border">{sub.quizId?.title || 'Quiz'}</td>
                      <td className="p-2 border">{sub.score}</td>
                      <td className="p-2 border">{new Date(sub.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
