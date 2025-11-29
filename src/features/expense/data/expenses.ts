import { getMyExpenses, ExpenseResponse } from "../../../api/expenseApi";

// Schema cho DataGrid columns
const expenseHistorySchema = [
  { 
    field: "expense_id", 
    headerName: "ID", 
    flex: 1, 
    minWidth: 80, 
    maxWidth: 80 
  },
  {
    field: "description",
    headerName: "Tên giao dịch",
    flex: 1,
    minWidth: 150,
    maxWidth: 150,
    editable: true,
  },
  {
    field: "amount",
    headerName: "Số tiền",
    flex: 1,
    minWidth: 120,
    maxWidth: 120,
    editable: true,
    valueFormatter: (params: any) => {
      // Format số tiền với dấu phẩy và đơn vị VNĐ
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(params.value);
    },
  },
  {
    field: "CategoryName",
    headerName: "Loại giao dịch",
    flex: 1,
    minWidth: 150,
    maxWidth: 150,
  },
  {
    field: "CategoryType",
    headerName: "Phương thức",
    flex: 1,
    minWidth: 120,
    maxWidth: 120,
    valueFormatter: (params: any) => {
      return params.value === "expense" ? "Chi tiêu" : "Thu nhập";
    },
  },
  {
    field: "expenseDate",
    headerName: "Ngày giao dịch",
    type: "Date",
    flex: 1,
    minWidth: 150,
    maxWidth: 150,
    editable: true,
  },
];

/**
 * Fetch expense history data from API
 * @returns Promise<ExpenseResponse[]>
 */
const fetchExpenseHistoryData = async (): Promise<ExpenseResponse[]> => {
  try {
    const data = await getMyExpenses();
    
    // Transform data để có id field cho DataGrid (DataGrid yêu cầu id)
    return data.map(expense => ({
      ...expense,
      id: expense.expense_id, // DataGrid requires 'id' field
    }));
  } catch (error) {
    console.error("Error loading expense history:", error);
    throw error;
  }
};

/**
 * Sample/Mock data for development (nếu backend chưa sẵn sàng)
 * Có thể xóa khi đã kết nối API thành công
 */
const expenseHistoryDataMock: ExpenseResponse[] = [
  {
    expense_id: 1,
    user_id: 1,
    category_id: 1,
    description: "Mua sắm tạp hóa",
    amount: 500000,
    expenseDate: "2024-01-15",
    CategoryName: "Ăn uống",
    CategoryType: "Chi tiêu",
  },
  {
    expense_id: 2,
    user_id: 1,
    category_id: 2,
    description: "Lương tháng 1",
    amount: 15000000,
    expenseDate: "2024-01-01",
    CategoryName: "Lương",
    CategoryType: "Thu nhập",
  },
  {
    expense_id: 3,
    user_id: 1,
    category_id: 3,
    description: "Tiền điện tháng 1",
    amount: 350000,
    expenseDate: "2024-01-10",
    CategoryName: "Hóa đơn",
    CategoryType: "Chi tiêu",
  },
  {
    expense_id: 4,
    user_id: 1,
    category_id: 4,
    description: "Đổ xăng xe",
    amount: 200000,
    expenseDate: "2024-01-12",
    CategoryName: "Di chuyển",
    CategoryType: "Chi tiêu",
  },
  {
    expense_id: 5,
    user_id: 1,
    category_id: 5,
    description: "Thưởng dự án",
    amount: 5000000,
    expenseDate: "2024-01-20",
    CategoryName: "Affiliate",
    CategoryType: "Thu nhập",
  },
].map(expense => ({
  ...expense,
  id: expense.expense_id,
}));

export {
  expenseHistorySchema,
  fetchExpenseHistoryData,
  expenseHistoryDataMock,
};