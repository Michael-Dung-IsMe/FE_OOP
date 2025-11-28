import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, FormHelperText, Tab, Tabs } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";

// Type definitions
type Category = {
  category_id: number;
  name: string;
  type: "expense" | "income";
};

type TransactionFormValues = {
  description: string;
  category_id: number | string;
  amount: number | string;
  expense_date: string;
};

type TransactionData = {
  user_id: number;
  category_id: number;
  amount: number;
  description: string;
  expense_date: string;
};

const initialValues: TransactionFormValues = {
  description: "",
  category_id: "",
  amount: "",
  expense_date: new Date().toISOString().split('T')[0],
};

const validationSchema = yup.object().shape({
  description: yup.string().required("Vui lòng nhập tên giao dịch"),
  category_id: yup.number().required("Vui lòng chọn danh mục"),
  amount: yup.number().positive("Số tiền phải lớn hơn 0").required("Vui lòng nhập số tiền"),
  expense_date: yup.date().required("Vui lòng chọn ngày"),
});

const TransactionForm = () => {
  const [tabValue, setTabValue] = useState<0 | 1>(0); // 0: Chi tiêu, 1: Thu nhập
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories từ backend khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data: Category[] = await response.json();
          setCategories(data);
        } else {
          console.error("Lỗi khi lấy danh mục");
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue as 0 | 1);
  };

  const handleFormSubmit = async (
    values: TransactionFormValues, 
    { resetForm }: { resetForm: () => void }
  ) => {
    // Chuẩn bị dữ liệu JSON để gửi về backend
    const transactionData: TransactionData = {
      user_id: 1, // TODO: Thay bằng user_id thực tế từ session/auth
      category_id: Number(values.category_id),
      amount: parseFloat(values.amount as string),
      description: values.description,
      expense_date: values.expense_date,
    };

    console.log("Dữ liệu gửi đi:", JSON.stringify(transactionData, null, 2));

    try {
      // Gửi request tới backend API
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Tạo giao dịch thành công:", result);
        alert("Tạo giao dịch thành công!");
        resetForm();
      } else {
        console.error("Lỗi khi tạo giao dịch:", response.statusText);
        alert("Có lỗi xảy ra khi tạo giao dịch!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến server!");
    }
  };

  // Filter categories dựa theo tab đang chọn
  const filteredCategories = categories.filter(
    cat => cat.type === (tabValue === 0 ? "expense" : "income")
  );

  if (loading) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 3, textAlign: "center" }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
        Quản lý giao dịch
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Chi tiêu" />
        <Tab label="Thu nhập" />
      </Tabs>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              
              {/* Tên giao dịch */}
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
              />

              {/* Danh mục - Lấy từ database */}
              <FormControl 
                fullWidth 
                variant="filled"
                error={!!touched.category_id && !!errors.category_id}
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
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.category_id && errors.category_id && (
                  <FormHelperText>{errors.category_id}</FormHelperText>
                )}
              </FormControl>

              {/* Số tiền */}
              <TextField
                fullWidth
                variant="filled"
                color="info"
                type="number"
                label="Số tiền (VNĐ)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.amount}
                name="amount"
                inputProps={{ step: "0.001", min: "0" }}
                error={!!touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
              />

              {/* Ngày giao dịch */}
              <TextField
                fullWidth
                variant="filled"
                color="info"
                type="date"
                label="Ngày giao dịch"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.expense_date}
                name="expense_date"
                InputLabelProps={{ shrink: true }}
                error={!!touched.expense_date && !!errors.expense_date}
                helperText={touched.expense_date && errors.expense_date}
              />

              {/* Nút submit */}
              <Button 
                type="submit" 
                color="info" 
                variant="contained" 
                size="large"
                sx={{ mt: 1 }}
              >
                Tạo {tabValue === 0 ? "chi tiêu" : "thu nhập"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default TransactionForm;