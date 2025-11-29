import { useState } from "react";
import { Avatar, Box, Modal, Stack, Typography, useTheme } from "@mui/material";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import Item from "../../../components/Item";
import { tokens } from "../../../assets/theme";
import { expenseLimitsData } from "../data/budget";
import BudgetForm from "./ui/BudgetForm"; // Lưu ý: Đảm bảo import đúng tên file component mới (ExpenseForm hoặc BudgetForm)

// Style cho Modal
const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const BudgetLimits = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    currentValue: string;
    limit: string;
  } | null>(null);

  const handleOpen = (item: typeof selectedItem) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/,/g, ""));
  };

  const styles = {
    alignItems: "center",
    backgroundColor: colors.primary[500],
    borderRadius: "1rem",
    cursor: "pointer",
    display: "flex",
    gap: "1rem",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(clamp(250px, 16vw, 860px), 1fr))",
    padding: "1rem",
    transition: ".2s",
    width: "100%",
    "&:hover": {
      backgroundColor: colors.primary[400],
    },
  };

  return (
    <>
      <Item
        title="Danh mục ngân sách chi tiêu"
        content={
          <Stack
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              height: "100%",
              overflowY: "scroll",
              overflowX: "hidden",
              paddingRight: "1rem",
            }}
          >
            {expenseLimitsData.map((obj, index) => (
              <Box
                sx={styles}
                key={index}
                onClick={() => handleOpen(obj)}
              >
                <Avatar
                  sx={{
                    backgroundColor: `${colors.blueAccent[300]}`,
                    "& :hover, & .MuiAvatar-root svg:hover": {
                      backgroundColor: `${colors.blueAccent[300]} !important`,
                    },
                  }}
                >
                  <WalletOutlinedIcon />
                </Avatar>
                <Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {obj.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <Typography variant="h6" sx={{ color: colors.grey[300] }}>
                      {obj.currentValue} /
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      &nbsp;{obj.limit}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        }
        height={500}
      />

      {/* Modal chỉnh sửa */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {selectedItem && (
            <BudgetForm
              title={selectedItem.title}
              // Đã xóa currentAmount ở đây vì form tự fetch
              limit={parseCurrency(selectedItem.limit)}
              onSuccess={handleClose} // Thêm callback để đóng modal khi lưu thành công
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default BudgetLimits;