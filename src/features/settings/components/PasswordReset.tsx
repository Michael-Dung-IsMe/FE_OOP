import { Box, Typography, TextField, Button, Alert, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { changePassword } from "../../../api/authApi";

const PasswordReset = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Show/hide password states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation
  const validatePasswords = (): boolean => {
    if (!oldPassword) {
      setError("Please enter your old password");
      return false;
    }
    
    if (!newPassword) {
      setError("Please enter a new password");
      return false;
    }
    
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return false;
    }
    
    if (oldPassword === newPassword) {
      setError("New password must be different from old password");
      return false;
    }
    
    return true;
  };

  // Handle change password
  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    
    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword({
        oldPassword,
        newPassword,
      });

      if (response.success) {
        setSuccess("Password changed successfully!");
        // Clear all fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Auto clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to change password. Please check your old password.";
      setError(errorMessage);
      console.error("Change password error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <Box className="settingWrapper" sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Change Password</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Update your password to keep your account secure
        </Typography>
      </Box>

      {/* Alert Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Password Fields */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <TextField
          fullWidth
          label="Old Password"
          type={showOldPassword ? "text" : "password"}
          variant="outlined"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  edge="end"
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="New Password"
          type={showNewPassword ? "text" : "password"}
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
          helperText="Must be at least 6 characters"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Confirm New Password"
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleChangePassword}
          disabled={loading}
        >
          <Typography variant="h6">
            {loading ? "Changing..." : "Change Password"}
          </Typography>
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCancel}
          disabled={loading}
        >
          <Typography variant="h6">Cancel</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default PasswordReset;