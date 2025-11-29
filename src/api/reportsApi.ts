import axiosClient from "./axiosClient";
import { getMyExpensesBetween } from "./expenseApi";

// Định nghĩa kiểu dữ liệu
export interface ReportRequest {
    month: number;
    year: number;
}

export interface ReportRow {
    categoryName: string;
    amountSpent: number;
    amountLimit: number;
    difference: number;
}

export interface ReportResponse {
    rows: ReportRow[];
    totalSpent?: number;
    totalLimit?: number;
}

// Gọi API tạo báo cáo chi tiết cho một tháng
export const generateReport = async (req: ReportRequest): Promise<ReportResponse> => {
    try {
        const response = await axiosClient.post<ReportResponse>("/reports/generate", req);
        return response.data;
    } catch (error: any) {
        console.error("Error generating report:", error);
        throw new Error(error.response?.data?.message || "Không thể tạo báo cáo.");
    }
};

// Hàm lấy dữ liệu thu nhập trong tháng (Logic FE tự tính từ API expenses)
export const getMonthlyIncome = async (month: number, year: number): Promise<number> => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    // Tính ngày cuối tháng
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    try {
        // getMyExpensesBetween đã dùng axiosClient
        const expenses = await getMyExpensesBetween(startDate, endDate);
        
        // Lọc các giao dịch là "Thu nhập"
        const totalIncome = expenses
            .filter((e: any) => e.CategoryType === 'Thu nhập' || e.categoryType === 'Thu nhập')
            .reduce((sum, e) => sum + Number(e.amount), 0);
        
        return totalIncome;
    } catch (error) {
        console.error("Error fetching monthly income", error);
        return 0;
    }
};

// Hàm lấy dữ liệu cho biểu đồ 12 tháng (Thu vs Chi)
export const getFinancialHistoryData = async (year: number) => {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    try {
        const expenses = await getMyExpensesBetween(startDate, endDate);
        
        // Khởi tạo mảng 12 tháng
        const incomeData = Array(12).fill(0);
        const expenseData = Array(12).fill(0);

        expenses.forEach((e: any) => {
            const expenseDate = new Date(e.expenseDate);
            if (expenseDate.getFullYear() === year) {
                const monthIndex = expenseDate.getMonth(); // 0-11
                const amount = Number(e.amount);
                
                if (e.CategoryType === 'Thu nhập' || e.categoryType === 'Thu nhập') {
                    incomeData[monthIndex] += amount;
                } else {
                    expenseData[monthIndex] += amount;
                }
            }
        });

        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];  
        return [
            {
                id: "Thu nhập",
                data: months.map((m, i) => ({ x: m, y: incomeData[i] }))
            },
            {
                id: "Chi tiêu",
                data: months.map((m, i) => ({ x: m, y: expenseData[i] }))
            }
        ];
    } catch (error) {
        console.error("Error fetching financial history", error);
        return [];
    }
};