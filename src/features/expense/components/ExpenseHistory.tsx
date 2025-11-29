import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, CircularProgress, Alert } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import Item from "../../../components/Item";
import ContextMenu from "../../../components/ContextMenu";
import CustomToolbar from "../../../components/CustomToolbar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { expenseHistorySchema, fetchExpenseHistoryData, expenseHistoryDataMock } from "../data/expenses";
import ExpenseForm from "./ui/ExpenseForm";
import { ExpenseResponse, deleteExpense } from "../../../api/expenseApi";

const columns: GridColDef[] = [
  ...expenseHistorySchema,
  {
    field: "options",
    headerName: "",
    sortable: false,
    flex: 1,
    minWidth: 90,
    maxWidth: 90,
    renderCell: (params) => {
      return (
        <Box>
          <ContextMenu 
            onEdit={() => params.row.handleEdit(params.row)}
            onDelete={() => params.row.handleDelete(params.row)}
          />
        </Box>
      );
    },
  },
];

function DataTable() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [expenseData, setExpenseData] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [editingExpense, setEditingExpense] = useState<ExpenseResponse | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<ExpenseResponse | null>(null);

  useEffect(() => {
    loadExpenseData();
  }, [useMockData]);

  const loadExpenseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Chú ý: fetchExpenseHistoryData nên được kiểm tra xem có tương thích với ExpenseResponse[] không
      // Nếu bạn muốn dùng API thực tế từ expenseApi.ts, hãy thay bằng getMyExpenses()
      if (useMockData) {
        console.log("Using mock data");
        const dataWithHandlers = expenseHistoryDataMock.map(expense => ({
          ...expense,
          handleEdit: handleEdit,
          handleDelete: handleDeleteClick,
        }));
        setExpenseData(dataWithHandlers);
      } else {
        console.log("Fetching data");
        const data = await fetchExpenseHistoryData();
        const dataWithHandlers = data.map((expense: any) => ({
          ...expense,
          handleEdit: handleEdit,
          handleDelete: handleDeleteClick,
        }));
        setExpenseData(dataWithHandlers);
      }
    } catch (err) {
      console.error("Error loading expense data:", err);
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
      
      console.log("API failed, falling back to mock data");
      const dataWithHandlers = expenseHistoryDataMock.map(expense => ({
        ...expense,
        handleEdit: handleEdit,
        handleDelete: handleDeleteClick,
      }));
      setExpenseData(dataWithHandlers);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setEditingExpense(null); // Reset để mở form Tạo mới
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExpense(null);
  };

  const handleExpenseCreated = () => {
    handleCloseDialog();
    loadExpenseData();
  };

  const handleRefresh = () => {
    loadExpenseData();
  };

  const toggleDataSource = () => {
    setUseMockData(!useMockData);
  };

  // Handler khi nhấn Edit trên từng dòng
  const handleEdit = (expense: ExpenseResponse) => {
    console.log("Editing expense:", expense);
    setEditingExpense(expense); // Lưu thông tin dòng cần sửa
    setOpenDialog(true);        // Mở dialog
  };

  // Handler khi nhấn Delete
  const handleDeleteClick = (expense: ExpenseResponse) => {
    setDeletingExpense(expense);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;

    try {
      setDeleteLoading(true);
      // Gọi API deleteExpense từ expenseApi.ts
      const result = await deleteExpense(deletingExpense.expense_id);

      if (result.success) {
        alert(result.message);
        setOpenDeleteDialog(false);
        setDeletingExpense(null);
        loadExpenseData(); // Tải lại dữ liệu sau khi xóa
      } else {
        alert(result.error || "Có lỗi xảy ra khi xóa!");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Không thể kết nối đến server!");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setDeletingExpense(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box style={{ height: 400, width: "100%" }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error} - Đang hiển thị dữ liệu mẫu
        </Alert>
      )}

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
          
          <Button
            variant="text"
            size="small"
            onClick={toggleDataSource}
            sx={{ textTransform: "none" }}
          >
            {useMockData ? "📦 Mock Data" : "🔌 API Data"}
          </Button>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Thêm giao dịch
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {editingExpense ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ExpenseForm 
            onSuccess={handleExpenseCreated}
            // Truyền props cho chế độ chỉnh sửa
            editMode={!!editingExpense}
            expenseId={editingExpense?.expense_id}
            initialData={editingExpense ? {
              description: editingExpense.description,
              category_id: editingExpense.category_id,
              amount: editingExpense.amount,
              expenseDate: editingExpense.expenseDate, // API trả về string YYYY-MM-DD
            } : undefined}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={openDeleteDialog}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa giao dịch "${deletingExpense?.description}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        severity="error"
      />

      <DataGrid
        rows={expenseData}
        columns={columns}
        getRowId={(row) => row.expense_id} // Đảm bảo DataGrid biết field nào là ID
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          filterPanel: {
            sx: {
              maxWidth: "100vw"
            }
          },
          toolbar: {
            showQuickFilter: true,
          },
        }}
        editMode="row"
        initialState={{
          columns: {
            columnVisibilityModel: {
              remainingTerm: false,
            },
          },
          filter: {
            filterModel: {
              items: [],
              quickFilterExcludeHiddenColumns: true,
            },
          },
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        loading={loading}
      />
    </Box>
  );
}

export default function TransactionHistory() {
  return (
    <Item title="Lịch sử giao dịch" content={<DataTable />} height={500} />
  );
}