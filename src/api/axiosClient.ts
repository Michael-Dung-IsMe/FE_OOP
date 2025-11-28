// Contains axios instance with default settings
// Request: automatically include auth token if available
// Response: automatically get data from response and handle errors

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export const API_BASE_URL = 'http://localhost:8080/api';
export const USER_REST_API_URL = `${API_BASE_URL}/users`;
export const AUTH_REST_API_URL = `${API_BASE_URL}/auth`;
export const EXPENSE_REST_API_URL = `${API_BASE_URL}/expenses`;
export const BUDGET_REST_API_URL = `${API_BASE_URL}/budgets`;
export const REPORT_REST_API_URL = `${API_BASE_URL}/reports`;

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api/auth/login', // Đường dẫn tới Backend Spring Boot
    headers: {
        'Content-Type': 'application/json', // Báo cho BE biết dữ liệu gửi đi là JSON
    },
});

// Interceptor để tự động gắn Token vào mỗi request (nếu đã đăng nhập)
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor để xử lý dữ liệu trả về (Bóc tách dữ liệu)
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
        return response.data; // Chỉ lấy phần data của JSON
            
        }
        return response;
    },
    (error) => {
        
        throw error;
    }
);

export default axiosClient;