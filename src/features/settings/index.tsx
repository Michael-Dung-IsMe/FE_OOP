import { Box, Grid, Typography, useTheme } from "@mui/material";
import { tokens } from "../../assets/theme";
import { useEffect, useState } from "react";
import BasicInformation from "./components/BasicInformation";
import PasswordReset from "./components/PasswordReset";
import AuthenticationPreferences from "./components/AuthenticationPreferences";
import { getCurrentUser } from "../../api/authApi";

export default function Settings() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State cho user data
  const [userId, setUserId] = useState<number>(1); // Default, sẽ được load từ API
  const [fullName, setFullName] = useState<string>("Loading...");
  const [email, setEmail] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);

  // Load user data khi component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getCurrentUser();
      
      setUserId(userData.id || userData.user_id);
      setFullName(userData.fullName || userData.full_name || "User");
      setEmail(userData.email);
    } catch (error) {
      console.error("Failed to load user data:", error);
      
      // Fallback: Load từ localStorage nếu có
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUserId(user.id);
        setFullName(user.fullName || "User");
        setEmail(user.email);
      }
    } finally {
      setLoading(false);
    }
  };

  // Callback khi BasicInformation update thành công
  const handleUpdateSuccess = (newFullName: string) => {
    setFullName(newFullName);
    
    // Update localStorage nếu có
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      user.fullName = newFullName;
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  };

  if (loading) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h3">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header */}
      <Box sx={{ paddingBlock: 2, width: "100%" }}>
        <Typography variant="h1">CÀI ĐẶT</Typography>
        <Typography variant="h6">Quản lý thông tin của bạn</Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ backgroundColor: colors.primary[400], padding: 4, borderRadius: 2 }}>
        <Box sx={{ paddingBlock: 2, width: "100%" }}>
          <Typography variant="h3">HỒ SƠ</Typography>
          <Typography variant="h6">Cập nhật hồ sơ của bạn tại đây.</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Basic Information - Full width */}
          <Grid item xs={12}>
            <BasicInformation
              userId={userId}
              initialFullName={fullName}
              email={email}
              onUpdateSuccess={handleUpdateSuccess}
            />
          </Grid>

          {/* Password Reset - Half width on large screens */}
          <Grid item xs={12} lg={6}>
            <PasswordReset />
          </Grid>

          {/* Authentication Preferences - Half width on large screens */}
          <Grid item xs={12} lg={6}>
            <AuthenticationPreferences />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}