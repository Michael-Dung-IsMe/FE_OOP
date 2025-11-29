import axiosClient from "./axiosClient";

// Type definitions matching backend
export type Category = {
  category_id: number;
  CategoryName: string;
  CategoryType: "Chi tiêu" | "Thu nhập";
};

export type ExpenseResponse = {
  expense_id: number;
  user_id: number;
  category_id: number;
  amount: number;
  description: string;
  expenseDate: string; // Format: YYYY-MM-DD
  CategoryName?: string;
  CategoryType?: "Chi tiêu" | "Thu nhập" | string;
};

export type CreateExpenseRequest = {
  category_id: number;
  amount: number;
  description: string;
  expenseDate: string; // Format: YYYY-MM-DD
};

export type ExpenseUpdateRequest = {
  category_id?: number;
  amount?: number;
  description?: string;
  expenseDate?: string; // Format: YYYY-MM-DD
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

// Lấy danh sách danh mục (Categories)
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosClient.get<Category[]>("/category");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    throw new Error(error.response?.data?.message || "Không thể tải danh mục.");
  }
};

// Tạo giao dịch mới
export const createExpense = async (
  expenseData: CreateExpenseRequest
): Promise<ApiResponse<ExpenseResponse>> => {
  try {
    const response = await axiosClient.post<ExpenseResponse>("/expenses/create", expenseData);
    return {
      success: true,
      data: response.data,
      message: "Tạo giao dịch thành công!",
    };
  } catch (error: any) {
    console.error("Error creating expense:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Có lỗi xảy ra khi tạo giao dịch!",
    };
  }
};

// Lấy danh sách giao dịch của tôi
export const getMyExpenses = async (): Promise<ExpenseResponse[]> => {
  try {
    const response = await axiosClient.get<ExpenseResponse[]>("/expenses/my");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching my expenses:", error);
    throw new Error(error.response?.data?.message || "Không thể tải danh sách giao dịch.");
  }
};

// Lấy giao dịch trong khoảng thời gian
export const getMyExpensesBetween = async (
  startDate: string, // YYYY-MM-DD
  endDate: string    // YYYY-MM-DD
): Promise<ExpenseResponse[]> => {
  try {
    const response = await axiosClient.get<ExpenseResponse[]>("/expenses/between", {
      params: {
        start: startDate,
        end: endDate,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching expenses between dates:", error);
    throw new Error(error.response?.data?.message || "Không thể tải lịch sử giao dịch.");
  }
};

// Cập nhật giao dịch
export const updateExpense = async (
  expenseId: number,
  expenseData: ExpenseUpdateRequest
): Promise<ApiResponse<ExpenseResponse>> => {
  try {
    const response = await axiosClient.put<ExpenseResponse>(
      `/expenses/update/${expenseId}`,
      expenseData
    );

    return {
      success: true,
      data: response.data,
      message: "Cập nhật giao dịch thành công!",
    };
  } catch (error: any) {
    console.error("Error updating expense:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Có lỗi xảy ra khi cập nhật giao dịch!",
    };
  }
};

// Xóa giao dịch
export const deleteExpense = async (
  expenseId: number
): Promise<ApiResponse<void>> => {
  try {
    await axiosClient.delete(`/expenses/delete/${expenseId}`);
    return {
      success: true,
      message: "Xóa giao dịch thành công!",
    };
  } catch (error: any) {
    console.error("Error deleting expense:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Có lỗi xảy ra khi xóa giao dịch!",
    };
  }
};

// Helper: Lấy ngày hôm nay định dạng YYYY-MM-DD
export const getTodayDate = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};