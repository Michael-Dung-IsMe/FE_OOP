import { useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { resetPassword, ResetPasswordRequest } from '../api/authApi'; 

export default function ResetPasswordPage() {
    const { token } = useParams<{ token: string }>(); // Get token from URL
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError('Token không hợp lệ.');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await resetPassword({ token, newPassword } as ResetPasswordRequest);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000); // Redirect after 3s
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
        sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 2,
        }}
        >
        <Card sx={{ p: 4, width: '100%', maxWidth: 400, boxShadow: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="bold">
                Đặt lại mật khẩu
            </Typography>
                {success && <Alert severity="success" sx={{ mb: 2 }}>Mật khẩu đã được đặt lại thành công!</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Mật khẩu mới"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        autoFocus
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2, height: 48 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Đặt lại mật khẩu'}
                    </Button>
                </form>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" color="primary">
                        Quay lại đăng nhập
                        </Typography>
                    </RouterLink>
                </Box>
        </Card>
        </Box>
    );
}