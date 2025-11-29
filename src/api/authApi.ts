import axiosClient from "./axiosClient";

// ==================== Types ====================

export interface RegisterRequest {
  email: string;
  password: string;
  checkpassword: string;
  fullName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Tương ứng với JwtResponse.java
export interface JwtResponse {
  token: string;
  email: string;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
}

export interface UserUpdateRequest {
  fullName?: string;
  password?: string;
}

// ==================== API Functions ====================

/**
 * Đăng ký tài khoản mới
 * Endpoint: POST /api/auth/register
 */
export const register = async (data: RegisterRequest): Promise<UserResponse> => {
  const response = await axiosClient.post<UserResponse>('/auth/register', data);
  return response.data;
};

/**
 * Đăng nhập
 * Endpoint: POST /api/auth/login
 */
export const login = async (data: LoginRequest): Promise<JwtResponse> => {
  const response = await axiosClient.post<JwtResponse>('/auth/login', data);
  return response.data;
};

/**
 * Đăng xuất
 * Endpoint: POST /api/auth/logout
 */
export const logout = async (): Promise<void> => {
  await axiosClient.post('/auth/logout');
};

/**
 * Lấy thông tin user hiện tại (Profile)
 * Endpoint: GET /api/auth/in4
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await axiosClient.get<UserResponse>('/auth/in4');
  return response.data;
};

/**
 * Cập nhật thông tin hồ sơ (fullname, password)
 * Endpoint: PUT /api/auth/update
 */
export const updateUserProfile = async (data: UserUpdateRequest): Promise<UserResponse> => {
  const response = await axiosClient.put<UserResponse>('/auth/update', data);
  return response.data;
};

/**
 * Xóa tài khoản vĩnh viễn
 * Endpoint: DELETE /api/auth/delete
 */
export const deleteAccount = async (): Promise<{ message: string }> => {
  const response = await axiosClient.delete<{ message: string }>('/auth/delete');
  return response.data;
};

/*
export const forgotPassword = async (email: string) => { ... }
export const resetPassword = async (data: any) => { ... }
*/