import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from "@mui/material";
import { tokens } from "../../../assets/theme";

type SummaryTableProps = {
    totalIncome: number;
    totalExpense: number;
    totalBudget: number;
};

const SummaryTable = ({ totalIncome, totalExpense, totalBudget }: SummaryTableProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Tính toán các chỉ số (đơn vị k VNĐ)
    const expectedSavings = totalIncome - totalBudget;
    const actualSavings = totalIncome - totalExpense;

    // Format tiền tệ: Input đã là k VNĐ nên chỉ cần format số
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("vi-VN").format(val) + " k VNĐ";
    };

    return (
        <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", color: colors.grey[100] }}>
            Tóm tắt Tài chính
        </Typography>
        <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[400] }}>
            <Table>
            <TableHead sx={{ backgroundColor: colors.blueAccent[700] }}>
                <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tổng thu nhập</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tổng chi tiêu</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tiết kiệm dự kiến</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tiết kiệm thực tế</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                <TableCell sx={{ fontSize: "1.1rem", color: colors.greenAccent[500] }}>
                    {formatCurrency(totalIncome)}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem", color: colors.redAccent[500] }}>
                    {formatCurrency(totalExpense)}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>{formatCurrency(expectedSavings)}</TableCell>
                <TableCell
                    sx={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: actualSavings >= 0 ? colors.greenAccent[400] : colors.redAccent[400],
                    }}
                >
                    {formatCurrency(actualSavings)}
                </TableCell>
                </TableRow>
            </TableBody>
            </Table>
        </TableContainer>
        </Box>
    );
};

export default SummaryTable;