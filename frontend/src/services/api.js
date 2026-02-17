import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Employee API
export const employeeAPI = {
  applyLeave: (leaveData) => api.post('/employee/leaves', leaveData),
  getMyLeaves: () => api.get('/employee/leaves'),
  getLeaveBalance: () => api.get('/employee/leaves/balance'),
  cancelLeave: (id) => api.delete(`/employee/leaves/${id}`),
};

// Manager API
export const managerAPI = {
  getAllLeaves: () => api.get('/manager/leaves'),
  getPendingLeaves: () => api.get('/manager/leaves/pending'),
  approveOrRejectLeave: (id, data) => api.put(`/manager/leaves/${id}/approve`, data),
};

export default api;
