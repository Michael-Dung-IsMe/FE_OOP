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
import { ReportRow } from "../../../api/reportsApi";

type CategoryDetailTableProps = {
    data: ReportRow[];
};

const CategoryDetailTable = ({ data }: CategoryDetailTableProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Tính dòng Total (đơn vị k VNĐ)
    const totalSpent = data.reduce((sum, row) => sum + row.amountSpent, 0);
    const totalBudget = data.reduce((sum, row) => sum + row.amountLimit, 0);
    const totalDifference = data.reduce((sum, row) => sum + row.difference, 0);

    // Format tiền tệ: Input đã là k VNĐ
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("vi-VN").format(val) + " k"; 
    };

    return (
        <Box sx={{ height: "100%", minHeight: 400 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", color: colors.grey[100] }}>
            Chi tiết theo Danh mục (Đơn vị: k VNĐ)
        </Typography>
        <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[400], maxHeight: 400 }}>
            <Table stickyHeader size="small">
            <TableHead>
                <TableRow>
                <TableCell sx={{ backgroundColor: colors.blueAccent[700], color: "white", fontWeight: "bold" }}>
                    Tên danh mục
                </TableCell>
                <TableCell sx={{ backgroundColor: colors.blueAccent[700], color: "white", fontWeight: "bold" }}>
                    Đã chi tiêu
                </TableCell>
                <TableCell sx={{ backgroundColor: colors.blueAccent[700], color: "white", fontWeight: "bold" }}>
                    Ngân sách
                </TableCell>
                <TableCell sx={{ backgroundColor: colors.blueAccent[700], color: "white", fontWeight: "bold" }}>
                    Tiết kiệm (Dư/Thiếu)
                </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {/* Hàng Total nằm trên cùng */}
                <TableRow sx={{ backgroundColor: colors.blueAccent[800] }}>
                <TableCell sx={{ fontWeight: "bold", color: colors.greenAccent[400] }}>TỔNG CỘNG</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: colors.greenAccent[400] }}>
                    {formatCurrency(totalSpent)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: colors.greenAccent[400] }}>
                    {formatCurrency(totalBudget)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: colors.greenAccent[400] }}>
                    {formatCurrency(totalDifference)}
                </TableCell>
                </TableRow>

                {/* Các hàng dữ liệu */}
                {data.map((row, index) => (
                <TableRow key={index} hover>
                    <TableCell>{row.categoryName}</TableCell>
                    <TableCell>{formatCurrency(row.amountSpent)}</TableCell>
                    <TableCell>{formatCurrency(row.amountLimit)}</TableCell>
                    <TableCell
                    sx={{
                        color: row.difference >= 0 ? colors.greenAccent[500] : colors.redAccent[500],
                    }}
                    >
                    {formatCurrency(row.difference)}
                    </TableCell>
                </TableRow>
                ))}
                
                {data.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} align="center">Chưa có dữ liệu báo cáo</TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </TableContainer>
        </Box>
    );
};

export default CategoryDetailTable;