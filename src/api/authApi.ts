import axiosClient from "./axiosClient";


// ==================== Types ====================
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginRequest {
  Email: string; // backend nhận email
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  tokenType?: string;
  user: {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    roles?: string[];
  };
  message?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;        // token từ email
  newPassword: string;
}

// ==================== API Functions ====================

// Đăng ký tài khoản
export const register = async (data: RegisterRequest): Promise<any> => {
  const response = await axiosClient.post('/auth/register', data);
  return response.data;
};

// Đăng nhập
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>('/auth/login', data);
  return response.data;
};

// Đăng xuất (gọi axiosClient để invalidate token/session nếu cần)
export const logout = async (): Promise<any> => {
  const response = await axiosClient.post('/auth/logout');
  return response.data;
};

// Yêu cầu quên mật khẩu (gửi link reset qua email - chưa tích hợp authentication nên không thực hiện được)
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<any> => {
  const response = await axiosClient.post('/auth/forgot-password', data);
  return response.data;
};

// Đặt lại mật khẩu mới từ token
export const resetPassword = async (data: ResetPasswordRequest): Promise<any> => {
  const response = await axiosClient.post('/auth/reset-password', data);
  return response.data;
};

// Làm mới access token nếu backend hỗ trợ refresh token
export const refreshToken = async (): Promise<any> => {
  const response = await axiosClient.post('/auth/refresh-token');
  return response.data;
};


// Thêm access token vào header nếu có (khi lưu token trong localStorage hoặc redux)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // hoặc lấy từ store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi 401 toàn cục (token hết hạn)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const rs = await refreshToken();
        const newAccessToken = rs.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // Thử lại request ban đầu với token mới
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại → có thể redirect về login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;