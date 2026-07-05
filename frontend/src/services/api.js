import axios from 'axios';

// VITE_API_URL should point at the API root, e.g. http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Origin only (no /api suffix) — used to build absolute /uploads/... URLs for images.
export const API_BASE = API_URL.replace(/\/api\/?$/, '');

// Images now come back as full Cloudinary URLs, but older records may still hold a
// relative /uploads/... path — resolve either shape to something the browser can load.
export const resolveAssetUrl = (path) => {
    if (!path) return null;
    return /^https?:\/\//i.test(path) ? path : `${API_BASE}${path}`;
};

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to attach token
api.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

export default api;
