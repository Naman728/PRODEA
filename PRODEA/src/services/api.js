import axios from 'axios';

// Use relative URL to leverage Vite proxy in development
// The proxy in vite.config.js will forward /api requests to http://localhost:8000
// In production, you can set VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Users API
export const usersAPI = {
  getAll: () => api.get('/users/get_users'),
  getById: (id) => api.get(`/users/get_user_by_id?id=${id}`),
  create: (user) => api.post('/users/create_user', user),
  createMultiple: (users) => api.post('/users/create_multiple_users', users),
  update: (id, user) => api.put(`/users/update_user_by_id?id=${id}`, user),
  delete: (id) => api.delete(`/users/delete_user_by_id?id=${id}`),
};

// Posts API
export const postsAPI = {
  getAll: () => api.get('/posts/get_posts'),
  getById: (id) => api.get(`/posts/get_post_by_id?id=${id}`),
  create: (post) => api.post('/posts/create_multiple_posts', [post]),
  createMultiple: (posts) => api.post('/posts/create_multiple_posts', posts),
  update: (id, post) => api.put(`/posts/update_post_by_id?id=${id}`, post),
  delete: (id) => api.delete(`/posts/delete_post_by_id?id=${id}`),
  like: (id) => api.get(`/posts/like_post/${id}`),
  dislike: (id) => api.get(`/posts/dislike_post/${id}`),
};

// Comments API
export const commentsAPI = {
  getAll: () => api.get('/comments/get_comments'),
  getById: (id) => api.get(`/comments/get_comment_by_id?id=${id}`),
  create: (comment) => api.post('/comments/create_multiple_comments', [comment]),
  createMultiple: (comments) => api.post('/comments/create_multiple_comments', comments),
  update: (id, comment) => api.put(`/comments/update_comment_by_id?id=${id}`, comment),
  delete: (id) => api.delete(`/comments/delete_comment_by_id?id=${id}`),
  like: (id) => api.get(`/comments/like_comment/${id}`),
  dislike: (id) => api.get(`/comments/dislike_comment/${id}`),
};

// Solutions API
export const solutionsAPI = {
  getAll: () => api.get('/solutions/get_solutions'),
  getById: (id) => api.get(`/solutions/get_solution_by_id?id=${id}`),
  create: (solution) => api.post('/solutions/create_multiple_solutions', [solution]),
  createMultiple: (solutions) => api.post('/solutions/create_multiple_solutions', solutions),
  update: (id, solution) => api.put(`/solutions/update_solution_by_id?id=${id}`, solution),
  delete: (id) => api.delete(`/solutions/delete_solution_by_id?id=${id}`),
  like: (id) => api.get(`/solutions/like_solution/${id}`),
  dislike: (id) => api.get(`/solutions/dislike_solution/${id}`),
};

// Auth API
export const authAPI = {
  login: (formData) => {
    // Convert FormData to URLSearchParams for OAuth2PasswordRequestForm
    const params = new URLSearchParams();
    params.append('username', formData.get('username'));
    params.append('password', formData.get('password'));
    
    return api.post('/auth/login', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  register: (userData) => api.post('/auth/register', userData),
};

export default api;

