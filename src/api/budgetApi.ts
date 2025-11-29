import axiosClient from "./axiosClient";

// --- Type definitions ---

export type Budget = {
    budget_id: number;
    user_id: number;
    category_id: number;
    categoryName: string;
    amountLimit: number;
    startDate: string;
    endDate: string;
    currentAmount?: number;
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

// Lấy danh sách ngân sách
export const fetchBudgets = async (): Promise<Budget[]> => {
    try {
        const response = await axiosClient.get<Budget[]>("/budgets/my");
        return response.data;
    } catch (error: any) {
        console.error("Error fetching budgets:", error);
        throw new Error(error.response?.data?.message || "Không thể tải danh sách ngân sách. Vui lòng thử lại sau.");
    }
};

// Lấy tổng chi tiêu theo danh mục (dùng cho BudgetForm)
export const fetchTotalSpendByCategory = async (categoryName: string): Promise<number> => {
    try {
        const response = await axiosClient.get("/expenses/total", {
            params: { categoryName },
        });
        const result = response.data;
        return typeof result === "number" ? result : result.total || 0;
    } catch (error) {
        console.error(`Error fetching total spend for ${categoryName}:`, error);
        return 0;
    }
};

// Cập nhật giới hạn ngân sách
export const updateBudgetLimit = async (
    categoryName: string,
    newLimit: number
): Promise<ApiResponse<any>> => {
    try {
        const payload = {
            categoryName: categoryName,
            amount_limit: newLimit,
        };

        const response = await axiosClient.put("/budgets/update", payload);

        return {
            success: true,
            data: response.data,
            message: "Cập nhật ngân sách thành công!",
        };
    } catch (error: any) {
        console.error("Error updating budget limit:", error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || "Có lỗi xảy ra khi cập nhật ngân sách!",
        };
    }
};