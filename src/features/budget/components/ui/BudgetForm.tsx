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
  title: string;       // Tên danh mục (Cố định)
  limit: number;       // Giới hạn hiện tại (Có thể sửa)
  onSuccess?: () => void; // Callback khi update thành công (để đóng modal)
  // currentAmount không cần truyền từ props nữa vì sẽ fetch mới
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
        alert(result.message);
        if (onSuccess) onSuccess(); // Đóng modal
      } else {
        setSubmitError("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setSubmitError("Lỗi kết nối server.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }} >
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
              <TextField
                fullWidth
                variant="filled"
                value={title}
                disabled
                InputProps={{ readOnly: true }}
                inputProps={{ style: { textAlign: "center" } }}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  "& .MuiFilledInput-input": {
                    paddingTop: "14px !important",
                    paddingBottom: "14px !important",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                  }
                }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Chi tiêu hiện tại - Lấy từ API - Cố định */}
                <TextField
                  fullWidth
                  variant="filled"
                  value={currentAmount.toLocaleString()}
                  disabled
                  InputProps={{
                    readOnly: true,
                    endAdornment: <InputAdornment position="end">k VNĐ</InputAdornment>,
                  }}
                  inputProps={{ style: { textAlign: "center" } }}
                  sx={{
                    "& .MuiFilledInput-input": {
                      paddingTop: "14px !important",
                      paddingBottom: "14px !important",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                    }
                  }}
                />
                {/* Giới hạn ngân sách - Cho phép chỉnh sửa */}
                <TextField
                  fullWidth
                  variant="filled"
                  color="info"
                  type="number"
                  label="Giới hạn ngân sách"
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
                />
              </Box>

              <Button 
                type="submit" 
                color="info" 
                variant="contained" 
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default BudgetForm;