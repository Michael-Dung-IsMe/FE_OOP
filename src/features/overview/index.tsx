import { useEffect, useState } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import {
  ShoppingCartCheckout,
  Work,
} from "@mui/icons-material";
import BudgetAllocation from "../budget/components/BudgetAllocation";
import TransactionHistory from "../expense/components/ExpenseHistory";
import FinancialOverviewChart from "../reports/components/FinancialOverviewChart";
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

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm xử lý dữ liệu để tạo data cho biểu đồ từ danh sách giao dịch
  const processChartData = (expenses: ExpenseResponse[], categoryMap: Record<number, string>) => {
    const currentYear = new Date().getFullYear();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    // Khởi tạo mảng dữ liệu cho 12 tháng
    const incomeData = Array(12).fill(0);
    const expenseData = Array(12).fill(0);

    expenses.forEach((item) => {
      const date = new Date(item.expenseDate);
      // Chỉ lấy dữ liệu của năm hiện tại
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth(); // 0-11
        const type = item.CategoryType || categoryMap[item.category_id];
        // Vì đơn vị là k VNĐ nên giữ nguyên giá trị, nếu BE trả về đồng thì chia 1000
        // Ở đây giả định BE trả về đơn vị thực (đồng), ta chia 1000 để khớp với UI k VNĐ
        // Nếu BE đã trả về k VNĐ thì bỏ / 1000
        const amount = Number(item.amount) / 1000; 

        if (type === "Thu nhập") {
          incomeData[monthIndex] += amount;
        } else if (type === "Chi tiêu") {
          expenseData[monthIndex] += amount;
        }
      }
    });

    // Format theo cấu trúc của Nivo Chart
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
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Chỉ gọi 2 API cơ bản, không gọi getFinancialHistoryData nữa
        const [expensesData, categoriesData] = await Promise.all([
            getMyExpenses(),
            fetchCategories()
        ]);

        // Tạo map category
        const categoryTypeMap: Record<number, string> = {};
        categoriesData.forEach((cat: Category) => {
            categoryTypeMap[cat.category_id] = cat.CategoryType;
        });

        // 2. Tính toán tổng thu chi (cho Cards)
        let income = 0;
        let expense = 0;

        expensesData.forEach((item: ExpenseResponse) => {
            const type = item.CategoryType || categoryTypeMap[item.category_id];
            // Lưu ý: Tính tổng hiển thị Card (chia 1000 để ra k VNĐ)
            const amount = Number(item.amount) / 1000;

            if (type === "Thu nhập") {
                income += amount;
            } else if (type === "Chi tiêu") {
                expense += amount;
            }
        });

        setTotalIncome(income);
        setTotalExpense(expense);

        // 3. Tái sử dụng expensesData để tạo Chart Data
        const chartDataProcessed = processChartData(expensesData, categoryTypeMap);
        setChartData(chartDataProcessed);

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
              value={isLoading ? 0 : totalIncome}
              icon={<Work sx={{ color: colors.greenAccent[600] }} />}
              chartType={[1, 4, 2, 5, 7, 2, 4, 6]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <PersonalFinancesCard
              title="Chi tiêu"
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
            <FinancialOverviewChart data={chartData} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <BudgetAllocation />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}