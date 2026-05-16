import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
}

export function getToken() {
  return localStorage.getItem('token');
}

// Load token on init
const initToken = getToken();
if (initToken) api.defaults.headers.common['Authorization'] = `Bearer ${initToken}`;

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      // clear token and let app handle redirect
      setToken(null);
      // optionally dispatch an event
      window.dispatchEvent(new CustomEvent('api:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
