import axiosClient from "./axiosClient";
import { getMyExpensesBetween, ExpenseResponse } from "./expenseApi";

// Định nghĩa kiểu dữ liệu dựa trên request/response của ReportController và logic FE
export interface ReportRequest {
    month: number;
    year: number;
}

// Interface cho rows trả về từ backend (dựa trên bảng expense_report_rows)
export interface ReportRow {
    categoryName: string;
    amountSpent: number;
    amountLimit: number;
    difference: number;
}

export interface ReportResponse {
  // Giả sử BE trả về danh sách các row chi tiết
    rows: ReportRow[];
    totalSpent?: number;
    totalLimit?: number;
}

// Gọi API tạo báo cáo chi tiết cho một tháng
export const generateReport = async (req: ReportRequest): Promise<ReportResponse> => {
    const url = "/reports/generate";
    // Nếu BE trả về ResponseEntity<ReportResponse>
    const response = await axiosClient.post(url, req);
    return response.data;
};

// Hàm lấy dữ liệu thu nhập trong tháng
export const getMonthlyIncome = async (month: number, year: number): Promise<number> => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    // Tính ngày cuối tháng
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    try {
        const expenses = await getMyExpensesBetween(startDate, endDate);
        // Lọc các giao dịch là "Thu nhập" (dựa trên categoryType)
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
            const monthIndex = new Date(e.expenseDate).getMonth(); // 0-11
            const amount = Number(e.amount);
            
            if (e.CategoryType === 'Thu nhập' || e.categoryType === 'Thu nhập') {
                incomeData[monthIndex] += amount;
            } else {
                expenseData[monthIndex] += amount;
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
}