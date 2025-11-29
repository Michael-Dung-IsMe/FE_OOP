import { useEffect, useState } from "react";
import { Box, Grid, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, Snackbar } from "@mui/material";
import { 
  generateReport, 
  getMonthlyIncome, 
  getFinancialHistoryData,
  ReportRow 
} from "../../api/reportsApi";
import SummaryTable from "./components/SummaryTable";
import CategoryDetailTable from "./components/CategoryDetailTable";
import FinancialOverviewChart from "./components/FinancialOverviewChart";

// 1. Import dữ liệu mẫu
import { mockReportRows, financialOverviewData } from "./data/reports";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // State cho bộ lọc tháng (3 tháng gần nhất)
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [availableMonths, setAvailableMonths] = useState<{label: string, value: string}[]>([]);

  // State dữ liệu báo cáo
  const [table1Data, setTable1Data] = useState({
    income: 0,
    expense: 0,
    budget: 0
  });
  const [table2Rows, setTable2Rows] = useState<ReportRow[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Khởi tạo danh sách 3 tháng gần nhất
  useEffect(() => {
    const today = new Date();
    const months = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const value = `${year}-${month}`;
      const label = `Tháng ${month}/${year}`;
      months.push({ label, value });
    }
    setAvailableMonths(months);
    setSelectedMonth(months[0].value);
  }, []);

  // Fetch dữ liệu
  useEffect(() => {
    if (!selectedMonth) return;

    const fetchData = async () => {
      setLoading(true);
      setNotification(null); // Reset thông báo
      try {
        const [yearStr, monthStr] = selectedMonth.split("-");
        const year = parseInt(yearStr);
        const month = parseInt(monthStr);

        // -- Gọi API --
        // Lưu ý: Promise.allSettled giúp lấy kết quả của từng API mà không bị dừng nếu 1 cái lỗi
        const [reportResult, incomeResult, chartResult] = await Promise.allSettled([
            generateReport({ month, year }),
            getMonthlyIncome(month, year),
            getFinancialHistoryData(year)
        ]);

        // -- Xử lý kết quả Table 2 (Chi tiết danh mục) --
        let rows: ReportRow[] = [];
        if (reportResult.status === 'fulfilled') {
            rows = reportResult.value.rows || [];
        } else {
            console.warn("API report failed, using mock data for demo.");
        }

        // Logic Fallback: Nếu không có dữ liệu từ API (hoặc API lỗi), dùng Mock Data để demo
        if (rows.length === 0) {
            rows = mockReportRows; // Sử dụng dữ liệu mẫu từ reports.ts
            setNotification("Đang hiển thị dữ liệu mẫu (Demo Mode) do không tải được dữ liệu thực.");
        }
        
        // Tính toán lại tổng chi và ngân sách dựa trên rows (dù là thật hay mock)
        const totalExpense = rows.reduce((sum, r) => sum + r.amountSpent, 0);
        const totalBudget = rows.reduce((sum, r) => sum + r.amountLimit, 0);

        // -- Xử lý kết quả Table 1 (Thu nhập) --
        let income = 0;
        if (incomeResult.status === 'fulfilled') {
            income = incomeResult.value;
        }
        // Nếu income = 0 (có thể do API lỗi hoặc chưa có thu nhập), giả lập thu nhập để demo tính toán
        if (income === 0 && rows === mockReportRows) {
            income = 15000; // Mock thu nhập: 15 triệu (15,000 k VNĐ)
        }

        setTable1Data({
          income: income,
          expense: totalExpense,
          budget: totalBudget
        });

        setTable2Rows(rows);

        // -- Xử lý kết quả Chart --
        if (chartResult.status === 'fulfilled' && chartResult.value.length > 0) {
            setChartData(chartResult.value);
        } else {
            // Fallback chart data nếu API lỗi
            setChartData(financialOverviewData);
        }

      } catch (error) {
        console.error("Critical error fetching report data:", error);
        // Fallback toàn bộ khi lỗi nghiêm trọng
        setTable2Rows(mockReportRows);
        setChartData(financialOverviewData);
        setNotification("Lỗi kết nối. Đang hiển thị dữ liệu demo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Thông báo (Snackbar) khi dùng dữ liệu mẫu */}
      <Snackbar 
        open={!!notification} 
        autoHideDuration={6000} 
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          {notification}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ paddingBlock: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h1">BÁO CÁO TÀI CHÍNH</Typography>
          <Typography variant="h6">Theo dõi tình hình thu chi và tiết kiệm</Typography>
        </Box>
        
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Chọn tháng</InputLabel>
            <Select
              value={selectedMonth}
              label="Chọn tháng"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {availableMonths.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {/* CỘT TRÁI: Các bảng số liệu */}
          <Grid item xs={12} lg={6} xl={6}>
            <Box display="flex" flexDirection="column" gap={3}>
              <SummaryTable 
                totalIncome={table1Data.income}
                totalExpense={table1Data.expense}
                totalBudget={table1Data.budget}
              />
              <CategoryDetailTable data={table2Rows} />
            </Box>
          </Grid>
          {/* CỘT PHẢI: Biểu đồ */}
          <Grid item xs={12} lg={6} xl={6}>
            <FinancialOverviewChart data={chartData} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Reports;