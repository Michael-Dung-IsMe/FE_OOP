import { Avatar, Box, Button, Typography, useTheme, TextField, IconButton } from "@mui/material";
import { Edit, Refresh } from "@mui/icons-material";
import { tokens } from "../../../assets/theme";
import { useState, useEffect } from "react";
import { getOrCreateAvatar, regenerateAvatar } from "./generateAvatar";
import { updateUserProfile } from "../../../api/authApi";

interface BasicInformationProps {
  userId: number;
  initialFullName: string;
  email: string;
  onUpdateSuccess?: (newFullName: string) => void;
}

const BasicInformation = ({ userId, initialFullName, email, onUpdateSuccess }: BasicInformationProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(initialFullName);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load avatar khi component mount
  useEffect(() => {
    const avatar = getOrCreateAvatar(initialFullName, userId);
    setAvatarUrl(avatar);
  }, [initialFullName, userId]);

  // Regenerate avatar
  const handleRegenerateAvatar = () => {
    const newAvatar = regenerateAvatar(fullName, userId);
    setAvatarUrl(newAvatar);
  };

  // Save changes
  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("Full name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await updateUserProfile({ fullName });
      
      if (response.success) {
        setIsEditing(false);
        // Regenerate avatar với tên mới
        const newAvatar = regenerateAvatar(fullName, userId);
        setAvatarUrl(newAvatar);
        
        // Callback để parent component biết đã update
        if (onUpdateSuccess) {
          onUpdateSuccess(fullName);
        }
        
        alert("Profile updated successfully!");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Update profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFullName(initialFullName);
    setIsEditing(false);
    setError("");
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[500],
        borderRadius: 2,
        padding: 3,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Basic Information</Typography>
      </Box>

      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          gap: 2,
        }}
      >
        {/* Avatar với nút regenerate */}
        <Box sx={{ position: "relative" }}>
          <Avatar
            alt="User Avatar"
            src={avatarUrl}
            sx={{ height: 90, width: 90 }}
          />
          <IconButton
            size="small"
            onClick={handleRegenerateAvatar}
            sx={{
              position: "absolute",
              bottom: -5,
              right: -5,
              backgroundColor: colors.greenAccent[600],
              "&:hover": {
                backgroundColor: colors.greenAccent[700],
              },
            }}
          >
            <Refresh fontSize="small" />
          </IconButton>
        </Box>

        {/* User Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flex: 1,
          }}
        >
          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                variant="outlined"
                size="small"
                error={!!error}
                helperText={error}
              />
              <Typography variant="body2" color={colors.grey[300]}>
                Email: {email} (cannot be changed)
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h4">{fullName}</Typography>
              <Typography variant="h6" color={colors.grey[100]}>
                {email}
              </Typography>
            </>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ ml: "auto" }}>
          {isEditing ? (
            <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
              <Button
                color="success"
                variant="contained"
                size="small"
                onClick={handleSave}
                disabled={loading}
              >
                <Typography variant="h6">
                  {loading ? "Saving..." : "Save"}
                </Typography>
              </Button>
              <Button
                color="error"
                variant="outlined"
                size="small"
                onClick={handleCancel}
                disabled={loading}
              >
                <Typography variant="h6">Cancel</Typography>
              </Button>
            </Box>
          ) : (
            <Button
              color="success"
              endIcon={<Edit />}
              variant="outlined"
              onClick={() => setIsEditing(true)}
            >
              <Typography variant="h6">Edit</Typography>
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BasicInformation;