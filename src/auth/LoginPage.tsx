import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { login, LoginRequest } from '../api/authApi';
import { ACCESS_TOKEN_KEY } from '../api/axiosClient'; // Import key thống nhất để tránh sai sót

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await login(formData);
            if (res.token) {
                localStorage.setItem(ACCESS_TOKEN_KEY, res.token);
                // Lưu thêm email để hiển thị nhanh trên UI nếu cần
                localStorage.setItem('userEmail', res.email);
            }
            navigate('/dashboard'); 
        } catch (err: any) {
            console.error("Login failed:", err);
            const message = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
            setError(message);
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
            Đăng nhập
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    autoFocus
                />
                <TextField
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2, height: 48 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
                </Button>
            </form>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
            <RouterLink to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                Quên mật khẩu?
                </Typography>
            </RouterLink>
            <Typography variant="body2" sx={{ mt: 1 }}>
                Chưa có tài khoản?{' '}
                <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                <Typography component="span" variant="body2" color="primary">
                    Đăng ký
                </Typography>
                </RouterLink>
            </Typography>
            </Box>
        </Card>
        </Box>
    );
}