import { create } from "zustand";
import axios from "axios";

const Base_URL = import.meta.env.VITE_API_URL;
const API_URL = `${Base_URL}/api/v1/quizzes`;
axios.defaults.withCredentials = true;

export const useQuizzesStore = create((set) => ({
  quizzes: [],
  quiz: null,
  isLoading: false,
  error: null,

  createQuiz: async (quizData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}`, quizData);
      set((state) => ({
        quizzes: [...state.quizzes, response.data.quiz],
        quiz: response.data.quiz,
        isLoading: false,
      }));
      return response.data.quiz;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating quiz",
        isLoading: false,
      });
      throw error;
    }
  },

  getMyQuizzes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/my`);
      set({ quizzes: response.data.quizzes, isLoading: false });
      return response.data.quizzes;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching quizzes",
        isLoading: false,
      });
      throw error;
    }
  },

  getQuizById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      set({ quiz: response.data.quiz, isLoading: false });
      return response.data.quiz;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching quiz",
        isLoading: false,
      });
      throw error;
    }
  },

  updateQuiz: async (id, quizData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, quizData);
      set((state) => ({
        quizzes: state.quizzes.map((q) => (q._id === id ? response.data.quiz : q)),
        quiz: response.data.quiz,
        isLoading: false,
      }));
      return response.data.quiz;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating quiz",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteQuiz: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        quizzes: state.quizzes.filter((q) => q._id !== id),
        quiz: null,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting quiz",
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch available quizzes for students
  getAvailableQuizzes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/available`);
      set({ quizzes: response.data.quizzes, isLoading: false });
      return response.data.quizzes;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching available quizzes",
        isLoading: false,
      });
      throw error;
    }
  },
})); 