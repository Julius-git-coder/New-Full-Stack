import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// User API calls
export const userAPI = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  // Get single user
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user with file
  createUser: async (formData) => {
    const response = await api.post("/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update user
  updateUser: async (id, formData) => {
    const response = await api.put(`/users/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Get download URL
  getDownloadUrl: (id) => {
    return `${API_URL}/users/${id}/download`;
  },
};

export default api;
