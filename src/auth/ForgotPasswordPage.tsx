import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { forgotPassword, ForgotPasswordRequest } from '../api/authApi';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await forgotPassword({ email } as ForgotPasswordRequest);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000); // Redirect after 3s
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
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
            Quên mật khẩu
            </Typography>
                {success && <Alert severity="success" sx={{ mb: 2 }}>Email đặt lại mật khẩu đã được gửi!</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email của bạn"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Gửi yêu cầu'}
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