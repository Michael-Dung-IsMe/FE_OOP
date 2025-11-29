import { useEffect, useState } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import {
  ShoppingCartCheckout,
  Work,
} from "@mui/icons-material";
import BudgetAllocation from "../budget/components/BudgetAllocation";
import TransactionHistory from "../expense/components/ExpenseHistory";
import FinancialOverview from "../reports/components/FinancialOverview";
import PersonalFinancesCard from "./components/PersonalFinanceCard";
import { tokens } from "../../assets/theme";

import { 
  getMyExpenses, 
  fetchCategories, 
  ExpenseResponse, 
  Category 
} from "../../api/expenseApi"; 

export default function Overview() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Khởi tạo state để lưu tổng tiền
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm lấy dữ liệu và tính toán
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Gọi song song cả API lấy expense và category để tối ưu tốc độ
        const [expensesData, categoriesData] = await Promise.all([
            getMyExpenses(),
            fetchCategories()
        ]);

        // Tạo một map để tra cứu nhanh loại danh mục theo ID (phòng trường hợp expenseData thiếu field CategoryType)
        const categoryTypeMap: Record<number, string> = {};
        categoriesData.forEach((cat: Category) => {
            categoryTypeMap[cat.category_id] = cat.CategoryType;
        });

        let income = 0;
        let expense = 0;

        expensesData.forEach((item: ExpenseResponse) => {
            // Xác định loại: Ưu tiên lấy từ item, nếu không có thì tra cứu trong map
            const type = item.CategoryType || categoryTypeMap[item.category_id];
            
            // Convert amount sang number để đảm bảo tính toán đúng
            const amount = Number(item.amount);

            if (type === "Thu nhập") {
                income += amount;
            } else if (type === "Chi tiêu") {
                expense += amount;
            }
        });

        setTotalIncome(income);
        setTotalExpense(expense);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ paddingBlock: 2, width: "100%" }}>
          <Typography variant="h1">TỔNG QUAN</Typography>
          <Typography variant="h6">
            Tổng quan về tình hình tài chính của bạn
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid item xs={12} md={6}>
            <PersonalFinancesCard
              title="Thu nhập"
              // Truyền giá trị state vào đây
              value={isLoading ? 0 : totalIncome}
              icon={<Work sx={{ color: colors.greenAccent[600] }} />}
              chartType={[1, 4, 2, 5, 7, 2, 4, 6]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PersonalFinancesCard
              title="Chi tiêu"
              // Truyền giá trị state vào đây
              value={isLoading ? 0 : totalExpense}
              icon={
                <ShoppingCartCheckout sx={{ color: colors.greenAccent[600] }} />
              }
              chartType={[3, -10, -2, 5, 7, -2, 4, 6]}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TransactionHistory />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <FinancialOverview />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={6} lg={4}>
            <SpendingBreakdown />
          </Grid> */}
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <BudgetAllocation />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}