/**
 * MOCK DATA (DỮ LIỆU GIẢ LẬP)
 * ---------------------------
 * File này chứa dữ liệu mẫu dùng để Demo giao diện hoặc Test khi chưa kết nối API.
 * Đơn vị tiền tệ: k VNĐ (nghìn đồng)
 */

// Dữ liệu mẫu cho biểu đồ Trend Analysis
export const trendAnalysisData = [
  {
    id: "Thuê nhà",
    color: "hsl(152, 70%, 50%)",
    data: [
      { x: "JAN", y: 350 }, { x: "FEB", y: 400 }, { x: "MAR", y: 550 },
      { x: "APR", y: 500 }, { x: "MAY", y: 410 }, { x: "JUN", y: 430 },
      { x: "JUL", y: 510 }, { x: "AUG", y: 460 }, { x: "SEP", y: 640 },
      { x: "OCT", y: 690 }, { x: "NOV", y: 450 }, { x: "DEC", y: 480 },
    ],
  },
  {
    id: "Tiện ích",
    color: "hsl(30, 70%, 50%)",
    data: [
      { x: "JAN", y: 600 }, { x: "FEB", y: 550 }, { x: "MAR", y: 400 },
      { x: "APR", y: 625 }, { x: "MAY", y: 480 }, { x: "JUN", y: 570 },
      { x: "JUL", y: 700 }, { x: "AUG", y: 750 }, { x: "SEP", y: 450 },
      { x: "OCT", y: 560 }, { x: "NOV", y: 490 }, { x: "DEC", y: 600 },
    ],
  },
];

// Dữ liệu mẫu cho biểu đồ Tổng quan tài chính
export const financialOverviewData = [
  {
    id: "Chi tiêu", 
    data: [
      { x: "JAN", y: 1300 }, { x: "FEB", y: 700 }, { x: "MAR", y: 900 },
      { x: "APR", y: 1100 }, { x: "MAY", y: 1000 }, { x: "JUN", y: 1900 },
      { x: "JUL", y: 1300 }, { x: "AUG", y: 2100 }, { x: "SEP", y: 1400 },
      { x: "OCT", y: 1200 }, { x: "NOV", y: 2300 }, { x: "DEC", y: 1800 },
    ],
  },
  {
    id: "Thu nhập",
    data: [
      { x: "JAN", y: 5500 }, { x: "FEB", y: 5300 }, { x: "MAR", y: 5400 },
      { x: "APR", y: 5600 }, { x: "MAY", y: 5700 }, { x: "JUN", y: 4900 },
      { x: "JUL", y: 5100 }, { x: "AUG", y: 5300 }, { x: "SEP", y: 6000 },
      { x: "OCT", y: 6500 }, { x: "NOV", y: 6300 }, { x: "DEC", y: 6100 },
    ],
  },
];

// Dữ liệu mẫu cho biểu đồ phân tích chi tiêu
export const spendingBreakdownData = [
  { day: "T2", rent: 20, utilities: 120, internet: 15, phone: 10, other: 150 },
  { day: "T3", rent: 40, utilities: 90, internet: 30, phone: 40, other: 120 },
  { day: "T4", rent: 30, utilities: 75, internet: 35, phone: 45, other: 70 },
  { day: "T5", rent: 60, utilities: 50, internet: 55, phone: 25, other: 60 },
  { day: "T6", rent: 70, utilities: 40, internet: 20, phone: 10, other: 100 },
  { day: "T7", rent: 60, utilities: 50, internet: 45, phone: 65, other: 80 },
  { day: "CN", rent: 50, utilities: 70, internet: 50, phone: 60, other: 100 },
];

export const budgetComparisonData = [
  { category: "Thực phẩm", budget: 500, actual: 400 },
  { category: "Thuê nhà", budget: 1000, actual: 950 },
  { category: "Di chuyển", budget: 200, actual: 180 },
  { category: "Giải trí", budget: 300, actual: 350 },
  { category: "Sức khỏe", budget: 150, actual: 120 },
  { category: "Tiện ích", budget: 250, actual: 200 },
  { category: "Khác", budget: 400, actual: 420 },
];

// Dữ liệu mẫu MỚI cho bảng
export const mockReportRows = [
  { 
    categoryName: "Ăn uống", 
    amountSpent: 4500, 
    amountLimit: 5000, 
    difference: 500 
  },
  { 
    categoryName: "Di chuyển", 
    amountSpent: 1200, 
    amountLimit: 1000, 
    difference: -200 
  },
  { 
    categoryName: "Nhà cửa", 
    amountSpent: 3000, 
    amountLimit: 3000, 
    difference: 0 
  },
  { 
    categoryName: "Giải trí", 
    amountSpent: 800, 
    amountLimit: 1500, 
    difference: 700 
  },
];