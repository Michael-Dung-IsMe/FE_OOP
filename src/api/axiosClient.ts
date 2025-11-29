// - baseURL dùng chung cho mọi API
// - Request: tự động gắn auth token nếu có
// - Response: trả về nguyên response (authApi, ... tự .data)

import axios, { AxiosInstance } from "axios";

// ================== BASE URL & REST URL ==================

export const API_BASE_URL = "http://localhost:8080/api";
export const USER_REST_API_URL = `${API_BASE_URL}/users`;
export const AUTH_REST_API_URL = `${API_BASE_URL}/auth`;
export const EXPENSE_REST_API_URL = `${API_BASE_URL}/expenses`;
export const BUDGET_REST_API_URL = `${API_BASE_URL}/budgets`;
export const REPORT_REST_API_URL = `${API_BASE_URL}/reports`;

export const ACCESS_TOKEN_KEY = 'accessToken';

// ================== AXIOS INSTANCE ==================

const axiosClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // nếu BE dùng cookie / HttpOnly cookie
});

// ================== INTERCEPTORS ==================

// Gắn Bearer token vào mọi request nếu có
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
        // đảm bảo headers tồn tại
            config.headers = config.headers ?? {};
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Trả về nguyên response để các API layer tự xử lý .data
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // có thể log / xử lý chung ở đây nếu muốn
        return Promise.reject(error);
    }
);

export default axiosClient;