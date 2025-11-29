import { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
// Import hook useNavigate để chuyển trang
import { useNavigate } from "react-router-dom";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import userImage from "../assets/user.png";
import { ColorModeContext, tokens } from "../assets/theme";

export default function UserMenu() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  
  // Khởi tạo hook điều hướng
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Hàm xử lý sự kiện Logout
  const handleLogout = () => {
    // 1. Đóng menu
    handleCloseUserMenu();

    // 2. Xóa accessToken (và thông tin user nếu có)
    // Bạn hãy thay 'accessToken' bằng tên key thực tế bạn đang lưu trong localStorage
    localStorage.removeItem("accessToken"); 
    localStorage.removeItem("user"); 

    // 3. Chuyển hướng về trang login
    navigate("/login");
  };
  
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "inline-flex",
        flexGrow: 0,
        gap: 2,
      }}
    >
      <Typography
        variant="h6"
        color={colors.primary[100]}
        sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
      >
        John Smith
      </Typography>
      <Tooltip title="">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="User Avatar" src={userImage} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{
          mt: "45px",
          "& .MuiMenu-paper": {
            backgroundColor: colors.primary[400],
          },
        }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <Divider sx={{ display: { xs: "flex", sm: "flex", md: "none" } }} />
        <MenuItem onClick={handleCloseUserMenu}>
          <ListItemIcon>
            <PersonOutlinedIcon />
          </ListItemIcon>
          <Typography variant="h5">My Profile</Typography>
        </MenuItem>
        
        <MenuItem
          onClick={() => {
            colorMode.toggleColorMode();
            handleCloseUserMenu(); // Đóng menu sau khi chọn
          }}
          sx={{
            display: { xs: "flex", sm: "flex", md: "none" },
          }}
        >
          <ListItemIcon>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon
                sx={{ width: "1.5rem", height: "1.5rem" }}
              />
            ) : (
              <LightModeOutlinedIcon
                sx={{ width: "1.5rem", height: "1.5rem" }}
              />
            )}
          </ListItemIcon>
          <Typography variant="h5">
            Enable {theme.palette.mode === "dark" ? `light` : `dark`} mode
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handleCloseUserMenu}
          sx={{
            display: { xs: "flex", sm: "flex", md: "none" },
          }}
        >
          <ListItemIcon>
            <InfoOutlinedIcon />
          </ListItemIcon>
          <Typography variant="h5">Information</Typography>
        </MenuItem>
        <Divider />
        
        <MenuItem onClick={handleCloseUserMenu}>
          <ListItemIcon>
            <SettingsOutlinedIcon />
          </ListItemIcon>
          <Typography variant="h5">Settings</Typography>
        </MenuItem>
        
        {/* Gắn sự kiện handleLogout vào MenuItem này */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          <Typography variant="h5">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}