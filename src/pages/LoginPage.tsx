import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Fade, InputAdornment } from '@mui/material';
import { useNavigate, Link, data } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../store/authSlice';
import axios from 'axios';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/users/login', { email, password });
            if (res.data && res.data.data && res.data.data.token) {
                dispatch(setToken(res.data.data.token));
                localStorage.setItem('token', res.data.data.token);
                navigate('/');
            } else {
                setError('Login failed');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                bgcolor: 'linear-gradient(135deg, #18181c 0%, #232526 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Montserrat, sans-serif',
            }}
        >
            <Fade in timeout={700}>
                <Paper
                    elevation={8}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 5,
                        maxWidth: 400,
                        width: '95vw',
                        background: 'rgba(30,32,38,0.85)',
                        backdropFilter: 'blur(16px) saturate(120%)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: '0.4s',
                    }}
                >
                    <Typography variant="h4" fontWeight={900} mb={2} color="#fff" letterSpacing={1}>
                        Welcome Back
                    </Typography>
                    <Typography variant="subtitle1" color="#e50914" mb={3} fontWeight={700}>
                        Sign in to Movie Reviews
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: '#e50914' }} />
                                    </InputAdornment>
                                ),
                                style: { color: '#fff', background: '#232526', borderRadius: 8 },
                            }}
                            InputLabelProps={{ style: { color: '#b2b2b2' } }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: '#e50914' }} />
                                    </InputAdornment>
                                ),
                                style: { color: '#fff', background: '#232526', borderRadius: 8 },
                            }}
                            InputLabelProps={{ style: { color: '#b2b2b2' } }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3, fontWeight: 700, fontSize: 18, borderRadius: 2, background: 'linear-gradient(135deg, #e50914 0%, #232526 100%)' }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </Button>
                    </form>
                    <Typography mt={3} color="#b2b2b2" fontSize={15}>
                        Don&apos;t have an account?{' '}
                        <Link to="/register" style={{ color: '#e50914', fontWeight: 700, textDecoration: 'none' }}>
                            Register
                        </Link>
                    </Typography>
                </Paper>
            </Fade>
        </Box>
    );
};

export default LoginPage; 