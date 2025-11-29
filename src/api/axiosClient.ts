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
    // withCredentials: true, // Bật nếu backend yêu cầu cookie
});

// ================== INTERCEPTORS ==================

axiosClient.interceptors.request.use(
    (config) => {
        /*
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            config.headers = config.headers ?? {};
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
        */
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => {
        // Trả về response.data nếu có, hoặc nguyên response
        return response;
    },
    (error) => {
        // Có thể log lỗi ra console hoặc xử lý logic refresh token nếu cần sau này
        return Promise.reject(error);
    }
);

export default axiosClient;