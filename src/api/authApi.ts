import axiosClient from "./axiosClient";

// ==================== Types ====================
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginRequest {
  Email: string;
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
  token: string;
  newPassword: string;
}

// ==================== NEW: Change Password ====================
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

// ==================== NEW: Update User Profile ====================
export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
}

export interface UpdateUserResponse {
  message: string;
  success: boolean;
  user?: {
    id: number;
    email: string;
    fullName?: string;
  };
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

// Đăng xuất
export const logout = async (): Promise<any> => {
  const response = await axiosClient.post('/auth/logout');
  return response.data;
};

// Yêu cầu quên mật khẩu
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<any> => {
  const response = await axiosClient.post('/auth/forgot-password', data);
  return response.data;
};

// Đặt lại mật khẩu mới từ token
export const resetPassword = async (data: ResetPasswordRequest): Promise<any> => {
  const response = await axiosClient.post('/auth/reset-password', data);
  return response.data;
};

// Làm mới access token
export const refreshToken = async (): Promise<any> => {
  const response = await axiosClient.post('/auth/refresh-token');
  return response.data;
};

// ==================== NEW: Change Password (trong Settings) ====================
/**
 * Đổi mật khẩu cho user đã đăng nhập
 * Endpoint: POST /api/auth/change-password
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const response = await axiosClient.post<ChangePasswordResponse>('/auth/change-password', data);
  return response.data;
};

// ==================== NEW: Update User Profile ====================
/**
 * Cập nhật thông tin user (fullName)
 * Endpoint: PUT /api/users/profile hoặc PATCH /api/users/profile
 */
export const updateUserProfile = async (data: UpdateUserRequest): Promise<UpdateUserResponse> => {
  const response = await axiosClient.put<UpdateUserResponse>('/users/profile', data);
  return response.data;
};

/**
 * Lấy thông tin user hiện tại
 * Endpoint: GET /api/users/profile
 */
export const getCurrentUser = async (): Promise<any> => {
  const response = await axiosClient.get('/users/profile');
  return response.data;
};

// ==================== Interceptors ====================

// Thêm access token vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi 401 toàn cục
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

        return axiosClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;