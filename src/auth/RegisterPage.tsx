import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { register, RegisterRequest } from '../api/authApi';

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterRequest>({ 
        email: '', 
        password: '', 
        checkpassword: '',
        fullName: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.checkpassword) {
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            await register(formData)
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login'); 
        } catch (err: any) {
            console.error("Register error:", err);
            setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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
            Đăng ký tài khoản
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Nhập đầy đủ họ tên"
                />
                <TextField
                    label="Mật khẩu (tối thiểu 6 ký tự)"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Nhập lại mật khẩu"
                    name="checkpassword"
                    type="password"
                    value={formData.checkpassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={formData.password !== formData.checkpassword && formData.checkpassword !== ''}
                />
                
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2, height: 48 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký'}
                </Button>
            </form>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2">
                    Đã có tài khoản?{' '}
                    <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                        <Typography component="span" variant="body2" color="primary">
                        Đăng nhập
                        </Typography>
                    </RouterLink>
                </Typography>
            </Box>
        </Card>
        </Box>
    );
}