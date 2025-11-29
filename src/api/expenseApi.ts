import { API_BASE_URL, ACCESS_TOKEN_KEY } from "./axiosClient";

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

console.log('API_BASE_URL:', API_BASE_URL);

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Fetch all categories from backend - GET /api/category
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const url = `${API_BASE_URL}/category`;
    console.log('Fetching categories from:', url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data: Category[] = await response.json();
    console.log('Categories loaded:', data);
      return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.");
    }
    throw new Error("Không thể tải danh mục. Vui lòng thử lại sau.");
  }
};

// Create a new expense - POST /api/expenses/create
export const createExpense = async (
  expenseData: CreateExpenseRequest
): Promise<ApiResponse<ExpenseResponse>> => {
  try {
    const url = `${API_BASE_URL}/expenses/create`;
    console.log("Creating expense at:", url);
    console.log("Expense data:", JSON.stringify(expenseData, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    });

    const result = await response.json();
    console.log("Create expense response:", result);

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: result,
      message: "Tạo giao dịch thành công!",
    };
  } catch (error) {
    console.error("Error creating expense:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo giao dịch!",
    };
  }
};

// Get my expenses - GET /api/expenses/my
export const getMyExpenses = async (): Promise<ExpenseResponse[]> => {
  try {
    const url = `${API_BASE_URL}/expenses/my`;
    console.log('Fetching my expenses from:', url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data: ExpenseResponse[] = await response.json();
    console.log('My expenses loaded:', data);
    return data;
  } catch (error) {
    console.error("Error fetching my expenses:", error);
    throw new Error("Không thể tải danh sách giao dịch. Vui lòng thử lại sau.");
  }
};

// Get expenses between date range
// GET /api/expenses/between?start=YYYY-MM-DD&end=YYYY-MM-DD
export const getMyExpensesBetween = async (
  startDate: string, // YYYY-MM-DD
  endDate: string    // YYYY-MM-DD
): Promise<ExpenseResponse[]> => {
  try {
    const params = new URLSearchParams({
      start: startDate,
      end: endDate,
    });

    const url = `${API_BASE_URL}/expenses/between?${params.toString()}`;
    console.log('Fetching expenses between dates from:', url);

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data: ExpenseResponse[] = await response.json();
    console.log('Expenses between dates loaded:', data);
    return data;
  } catch (error) {
    console.error("Error fetching expenses between dates:", error);
    throw new Error("Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.");
  }
};

// Update an existing expense - PUT /api/expenses/update/{id}
export const updateExpense = async (
  expenseId: number,
  expenseData: ExpenseUpdateRequest
): Promise<ApiResponse<ExpenseResponse>> => {
  try {
    const url = `${API_BASE_URL}/expenses/update/${expenseId}`;
    console.log("Updating expense at:", url);
    console.log("Update data:", JSON.stringify(expenseData, null, 2));

    const response = await fetch(url, {
      method: 'PUT',  
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: result,
      message: "Cập nhật giao dịch thành công!",
    };
  } catch (error) {
    console.error("Error updating expense:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật giao dịch!",
    };
  }
};

// Delete an expense - DELETE /api/expenses/delete/{id}
export const deleteExpense = async (
  expenseId: number
): Promise<ApiResponse<void>> => {
  try {
    const url = `${API_BASE_URL}/expenses/delete/${expenseId}`;
    console.log("Deleting expense at:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    return {
      success: true,
      message: "Xóa giao dịch thành công!",
    };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa giao dịch!",
    };
  }
};

/**
 * Helper function to format date to YYYY-MM-DD
 */
export const formatDateToYYYYMMDD = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Helper function to get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return formatDateToYYYYMMDD(new Date());
};