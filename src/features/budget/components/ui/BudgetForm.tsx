import { Box, Button, TextField, Typography, CircularProgress, Alert, InputAdornment } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import {
  fetchTotalSpendByCategory,
  updateBudgetLimit,
} from "../../../../api/budgetApi";

// ------------------------------------------------------------------------------

const validationSchema = yup.object().shape({
  limit: yup.number()
    .required("Vui lòng nhập giới hạn ngân sách")
    .positive("Giới hạn phải lớn hơn 0")
    .typeError("Vui lòng nhập số hợp lệ"),
});

export type BudgetFormProps = {
  title: string;          // Tên danh mục (Cố định)
  limit: number;          // Giới hạn hiện tại (Có thể sửa)
  onSuccess?: () => void; // Callback khi update thành công (để đóng modal)
}

const BudgetForm = ({ title, limit, onSuccess }: BudgetFormProps) => {
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 1. Fetch Current Amount từ Backend khi Modal mở (mount)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Gọi API lấy tổng chi tiêu thực tế của category này
        const amount = await fetchTotalSpendByCategory(title);
        setCurrentAmount(amount);
      } catch (err) {
        setError("Không thể tải dữ liệu chi tiêu hiện tại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      loadData();
    }
  }, [title]);

  const handleFormSubmit = async (
    values: { limit: number }, 
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setSubmitError(null);
      // Gọi API cập nhật Limit
      const result = await updateBudgetLimit(title, values.limit);

      if (result.success) {
        alert(result.message || "Cập nhật ngân sách thành công!");
        if (onSuccess) onSuccess(); // Đóng modal
      } else {
        setSubmitError(result.message || "Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Lỗi kết nối server.";
      setSubmitError(errorMsg);
      console.error("Update budget error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}>
        Điều chỉnh ngân sách
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          limit: limit,
        }}
        validationSchema={validationSchema}
        enableReinitialize // Cho phép cập nhật nếu props limit thay đổi
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
              
              {/* Tên Danh Mục - Cố định */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Danh mục
                </Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  value={title}
                  disabled
                  InputProps={{ readOnly: true }}
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    "& .MuiFilledInput-input": {
                      paddingTop: "14px !important",
                      paddingBottom: "14px !important",
                      textAlign: "center",
                      fontWeight: "bold",
                    }
                  }}
                />
              </Box>

              {/* Chi tiêu hiện tại và Giới hạn */}
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Chi tiêu hiện tại - Lấy từ API - Cố định */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Chi tiêu hiện tại
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    value={currentAmount.toLocaleString()}
                    disabled
                    InputProps={{
                      readOnly: true,
                      endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                    }}
                    sx={{
                      "& .MuiFilledInput-input": {
                        paddingTop: "14px !important",
                        paddingBottom: "14px !important",
                        textAlign: "right",
                        fontWeight: "bold",
                      }
                    }}
                  />
                </Box>

                {/* Giới hạn ngân sách - Cho phép chỉnh sửa */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Giới hạn ngân sách <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    color="info"
                    type="number"
                    placeholder="Nhập giới hạn"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.limit}
                    name="limit"
                    error={!!touched.limit && !!errors.limit}
                    helperText={touched.limit && errors.limit}
                    disabled={isSubmitting}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                    }}
                    sx={{
                      "& .MuiFilledInput-input": {
                        textAlign: "right",
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Hiển thị chênh lệch */}
              <Box sx={{ 
                p: 2, 
                backgroundColor: values.limit >= currentAmount ? "success.light" : "error.light",
                borderRadius: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Typography variant="body2" fontWeight="bold">
                  Chênh lệch:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {(values.limit - currentAmount).toLocaleString()} VNĐ
                </Typography>
              </Box>

              {/* Buttons */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button 
                  type="submit" 
                  color="success" 
                  variant="contained" 
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
                <Button 
                  type="button"
                  color="error" 
                  variant="outlined" 
                  size="large"
                  onClick={onSuccess}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default BudgetForm;