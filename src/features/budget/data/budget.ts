const budgetAllocationData = [
  {
    id: "Electricity",
    label: "Electricity",
    value: 19,
    color: "hsl(173, 70%, 50%)",
  },
  {
    id: "Phone",
    label: "Phone",
    value: 7,
    color: "hsl(352, 70%, 50%)",
  },
  {
    id: "Gas",
    label: "Gas",
    value: 10,
    color: "hsl(180, 70%, 50%)",
  },
  {
    id: "WaterSewer",
    label: "Water and sewer",
    value: 18,
    color: "hsl(128, 70%, 50%)",
  },
  {
    id: "Cable",
    label: "Cable",
    value: 5,
    color: "hsl(269, 70%, 50%)",
  },
  {
    id: "Waste",
    label: "Waste removal",
    value: 6,
    color: "hsl(24, 85%, 56%)",
  },
  {
    id: "Other",
    label: "Other",
    value: 35,
    color: "hsl(240, 9%, 81%)",
  },
];



const expenseLimitsData = [
  { title: "Ăn uống", currentValue: "2,500", limit: "3,000" },
  { title: "Di chuyển", currentValue: "600", limit: "1,500" },
  { title: "Giải trí", currentValue: "900", limit: "2,000" },
  { title: "Tiện ích", currentValue: "1,250", limit: "2,500" },
  { title: "Tiết kiệm", currentValue: "500", limit: "1,500" },
  { title: "Sức khỏe", currentValue: "80", limit: "500" },
  { title: "Mua sắm", currentValue: "200", limit: "500" },
  { title: "Giáo dục", currentValue: "50", limit: "300" },
  { title: "Khác", currentValue: "1,200", limit: "5,000" },
];

const savingsSchema = [
  { field: "id", headerName: "ID", flex: 1, minWidth: 80, maxWidth: 80 },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    minWidth: 160,
    maxWidth: 190,
  },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    minWidth: 110,
    maxWidth: 130,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    minWidth: 160,
    maxWidth: 190,
  },
  { field: "goal", headerName: "Goal", flex: 1, minWidth: 110, maxWidth: 130 },
  {
    field: "targetDate",
    headerName: "Target Date",
    flex: 1,
    minWidth: 130,
    maxWidth: 160,
  },
  { field: "progress", headerName: "Progress" },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
    minWidth: 120,
    maxWidth: 100,
  },
  {
    field: "status",
    headerName: "Status",
    description: "This column has a value getter and is not sortable.",
    flex: 1,
    minWidth: 130,
    maxWidth: 160,
  },
];

export {
  budgetAllocationData,
  expenseLimitsData,
  savingsSchema,
};
