import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/submissions";
axios.defaults.withCredentials = true;

export const useSubmissionStore = create((set) => ({
  submissions: [],
  submission: null,
  isLoading: false,
  error: null,

  // Submit a quiz
  submitQuiz: async (submissionData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/`, submissionData);
      set({ submission: response.data.submission, isLoading: false });
      return response.data.submission;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error submitting quiz", isLoading: false });
      throw error;
    }
  },

  // Get all submissions for the logged-in user
  getMySubmissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/my`);
      set({ submissions: response.data.submissions, isLoading: false });
      return response.data.submissions;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching submissions", isLoading: false });
      throw error;
    }
  },

  // Get all submissions for a specific quiz (for teachers/admin)
  getQuizSubmissions: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/quiz/${quizId}`);
      set({ submissions: response.data.submissions, isLoading: false });
      return response.data.submissions;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching quiz submissions", isLoading: false });
      throw error;
    }
  },

  // Get all submissions for a specific student (admin/student)
  getStudentResults: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/results/${studentId}`);
      set({ submissions: response.data.submissions, isLoading: false });
      return response.data.submissions;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching student results", isLoading: false });
      throw error;
    }
  },
}));
