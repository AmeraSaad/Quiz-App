import React from 'react';
import { useAuthStore } from '../store/authStore';
import TeacherPage from './teacher/teacherPage';
import StudentPage from './student/StudentPage';
// If you have a student page, import it here:
// import StudentPage from './student/studentPage';

const HomePage = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Quiz App</h1>
        <p className="text-lg text-gray-600">Please log in or sign up to continue.</p>
      </div>
    );
  }

  if (user?.role === 'teacher') {
    return <TeacherPage />;
  }else if (user?.role === 'student') {
    return <StudentPage />;
  }

  return null;
};

export default HomePage;
