// Expense Interface (Dựa trên bảng expenses)
export interface Expense {
    expenseId: number;
    userId: number;
    categoryId: number;
    // Bổ sung field này để hiển thị tên danh mục trên UI mà không cần map lại ID
    categoryName?: string; 
    amount: number;
    description: string;
    expenseDate: string; // Dạng 'YYYY-MM-DD'
    createdAt?: string;
}

// Interface dùng cho việc tạo mới Expense (không cần ID)
export interface ExpenseRequest {
    userId: number;
    categoryId: number;
    amount: number;
    description: string;
    expenseDate: string;
}

export interface ExpenseParams {
  page?: number;        // Trang số mấy
  limit?: number;       // Lấy bao nhiêu dòng
  sort?: string;        // Sắp xếp theo trường nào (vd: 'date:desc')
  categoryId?: number;  // Lọc theo danh mục
  startDate?: string;   // Lọc từ ngày
  endDate?: string;     // Lọc đến ngày
  keyword?: string;     // Tìm kiếm theo từ khóa mô tả
}