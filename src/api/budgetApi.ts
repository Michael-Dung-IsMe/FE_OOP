// src/api/budgetApi.ts
import { API_BASE_URL, ACCESS_TOKEN_KEY } from "./axiosClient";

// --- Type definitions ---

export type Budget = {
    budget_id: number;
    user_id: number;
    category_id: number;
    categoryName: string; // Tên danh mục để hiển thị
    amountLimit: number;
    startDate: string;
    endDate: string;
    currentAmount?: number; // Số tiền đã chi tiêu (được tính toán từ BE)
};

export type UpdateBudgetRequest = {
    categoryName: string;
    newLimit: number;
};

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
};

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

// Fetch all budgets for the current user
export const fetchBudgets = async (): Promise<Budget[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/budgets/my`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Budget[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching budgets:", error);
        throw new Error("Không thể tải danh sách ngân sách. Vui lòng thử lại sau.");
    }
};

// Used in BudgetForm to display "Current Amount"
export const fetchTotalSpendByCategory = async (
    categoryName: string
    ): Promise<number> => {
    try {
        const response = await fetch(
        `${API_BASE_URL}/expenses/total?categoryName=${encodeURIComponent(
            categoryName
        )}`,
        {
            headers: getAuthHeaders(),
        }
        );

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return typeof result === "number" ? result : result.total || 0;
    } catch (error) {
        console.error(`Error fetching total spend for ${categoryName}:`, error);
        return 0;
    }
};

// Update budget limit for a specific category
export const updateBudgetLimit = async (
    categoryName: string,
    newLimit: number
    ): Promise<ApiResponse<any>> => {
    try {
        const payload = {
            categoryName: categoryName,
            amount_limit: newLimit,
        };

        console.log("Updating budget limit:", JSON.stringify(payload, null, 2));

        const response = await fetch(
            `${API_BASE_URL}/budgets/update`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            }
        );

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        return {
            success: true,
            data: result,
            message: "Cập nhật ngân sách thành công!",
        };
    } catch (error) {
        console.error("Error updating budget limit:", error);
        return {
        success: false,
        error:
            error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi cập nhật ngân sách!",
        };
    }
    };
