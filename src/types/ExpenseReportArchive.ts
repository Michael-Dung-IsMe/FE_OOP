// Expense Report Archive Interface (Dựa trên bảng expense_report_archive)
export interface ExpenseReportArchive {
    id: number;
    userId: number;
    month: number;
    year: number;
    // Có thể chứa danh sách các dòng chi tiết bên trong
    rows?: ExpenseReportRow[]; 
}



// Expense Report Row Interface (Dựa trên bảng expense_report_rows)
export interface ExpenseReportRow {
    id: number;
    archiveId: number;
    categoryName: string;
    amountSpent: number;
    amountLimit: number;
    difference: number;
}