// Budget Interface (Dựa trên bảng budgets)
export interface Budget {
    budgetId: number;
    userId: number;
    categoryId: number;
    amountLimit: number;
    startDate: string;
    endDate: string;
}

