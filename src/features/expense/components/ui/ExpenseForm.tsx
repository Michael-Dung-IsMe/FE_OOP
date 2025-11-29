import { Box, Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText, Tab, Tabs, CircularProgress, Alert } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { 
  fetchCategories, 
  createExpense,
  updateExpense,
  getTodayDate,
  Category,
  CreateExpenseRequest,
  ExpenseUpdateRequest
} from "../../../../api/expenseApi";

// Định nghĩa lại Type cho Form Values để khớp với logic form
export type ExpenseFormValues = {
  description: string;
  category_id: number | string;
  amount: number | string;
  expenseDate: string;
};

// Cập nhật Props để nhận các biến phục vụ chế độ chỉnh sửa
type ExpenseFormProps = {
  onSuccess?: () => void;
  editMode?: boolean;               // Prop xác định chế độ sửa
  initialData?: ExpenseFormValues;  // Dữ liệu ban đầu khi sửa
  expenseId?: number;               // ID của giao dịch (bắt buộc khi update)
};

const defaultInitialValues: ExpenseFormValues = {
  description: "",
  category_id: "",
  amount: "",
  expenseDate: getTodayDate(), // YYYY-MM-DD format từ api
};

const validationSchema = yup.object().shape({
  description: yup.string().required("Vui lòng nhập tên giao dịch"),
  category_id: yup.number().required("Vui lòng chọn danh mục"),
  amount: yup.number().positive("Số tiền phải lớn hơn 0").required("Vui lòng nhập số tiền"),
  expenseDate: yup.date().required("Vui lòng chọn ngày"),
});

const ExpenseForm = ({ 
  onSuccess, 
  editMode = false, 
  initialData, 
  expenseId 
}: ExpenseFormProps) => { // Destructuring props tại đây để sửa lỗi
  const [tabValue, setTabValue] = useState<0 | 1>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Tự động chuyển Tab (Chi tiêu/Thu nhập) khi mở form edit dựa vào category của giao dịch
  useEffect(() => {
    if (editMode && initialData && categories.length > 0) {
      const currentCategory = categories.find(c => c.category_id === Number(initialData.category_id));
      if (currentCategory) {
        setTabValue(currentCategory.CategoryType === "Thu nhập" ? 1 : 0);
      }
    }
  }, [editMode, initialData, categories]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue as 0 | 1);
  };

  const handleFormSubmit = async (
    values: ExpenseFormValues, 
    { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setSubmitError(null);
      
      // Chuẩn bị dữ liệu chung
      const commonData = {
        category_id: Number(values.category_id),
        amount: parseFloat(values.amount as string),
        description: values.description,
        expenseDate: values.expenseDate,
      };

      let result;

      // Logic rẽ nhánh: Update hoặc Create
      if (editMode && expenseId) {
        // Gọi API Update: tham số (id, data)
        const updateData: ExpenseUpdateRequest = commonData;
        result = await updateExpense(expenseId, updateData);
      } else {
        // Gọi API Create: tham số (data)
        const createData: CreateExpenseRequest = commonData;
        result = await createExpense(createData);
      }

      if (result.success) {
        resetForm();
        if (onSuccess) onSuccess();
        alert(result.message);
      } else {
        setSubmitError(result.error || "Có lỗi xảy ra khi lưu giao dịch!");
      }
    } catch (err) {
      setSubmitError("Không thể kết nối đến server!");
      console.error("Form submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(
    cat => cat.CategoryType === (tabValue === 0 ? "Chi tiêu" : "Thu nhập")
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 1 }}>
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Chi tiêu" />
        <Tab label="Thu nhập" />
      </Tabs>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <Formik
        onSubmit={handleFormSubmit}
        // Nếu đang edit thì dùng initialData, nếu không dùng default
        initialValues={editMode && initialData ? initialData : defaultInitialValues}
        validationSchema={validationSchema}
        enableReinitialize // Cho phép form nhận data mới khi props thay đổi
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              
              <TextField
                fullWidth
                variant="filled"
                color="info"
                type="text"
                label="Tên giao dịch"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                disabled={isSubmitting}
              />

              <FormControl 
                fullWidth 
                variant="filled"
                error={!!touched.category_id && !!errors.category_id}
                disabled={isSubmitting}
              >
                <InputLabel>Danh mục</InputLabel>
                <Select
                  name="category_id"
                  value={values.category_id}
                  onChange={(e) => {
                    setFieldValue("category_id", e.target.value);
                  }}
                  onBlur={handleBlur}
                  label="Danh mục"
                >
                  {filteredCategories.map((cat) => (
                    <MenuItem key={cat.category_id} value={cat.category_id}>
                      {cat.CategoryName}
                    </MenuItem>
                  ))}
                </Select>
                {touched.category_id && errors.category_id && (
                  <FormHelperText>{errors.category_id}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                color="info"
                type="number"
                label="Số tiền (k VNĐ)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.amount}
                name="amount"
                inputProps={{ step: "0.001", min: "0" }}
                error={!!touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
                disabled={isSubmitting}
              />

              <TextField
                fullWidth
                variant="filled"
                color="info"
                type="date"
                label="Ngày giao dịch"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.expenseDate}
                name="expenseDate"
                InputLabelProps={{ shrink: true }}
                error={!!touched.expenseDate && !!errors.expenseDate}
                helperText={touched.expenseDate && errors.expenseDate}
                disabled={isSubmitting}
              />

              <Button 
                type="submit" 
                color="info" 
                variant="contained" 
                size="large"
                sx={{ mt: 1 }}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting 
                  ? "Đang xử lý..." 
                  : editMode 
                    ? "Cập nhật" 
                    : `Tạo ${tabValue === 0 ? "chi tiêu" : "thu nhập"}`
                }
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ExpenseForm;