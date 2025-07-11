import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Stack, Divider, Avatar, Button, Alert, Fade } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { MovieWithRating } from '../types/movie';
import type { Review } from '../types/review';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';
const fallbackPoster = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80';

const MovieDetailsPage: React.FC = () => {
    const { id } = useParams();
    const token = useSelector((state: RootState) => state.auth.token);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const navigate = useNavigate();
    const location = useLocation();
    const [movie, setMovie] = useState<MovieWithRating | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/movies/${id}`);
                setMovie(res.data.data || res.data);
            } catch {
                setMovie(null);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!isLoggedIn) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(
                `${API_BASE}/reviews`,
                { movieId: id, rating, comment: reviewText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Review added!');
            setReviewText('');
            setRating(5);
            // Refresh movie details to show new review
            const res = await axios.get(`${API_BASE}/movies/${id}`);
            setMovie(res.data.data || res.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to add review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" bgcolor="#18181c">
                <CircularProgress color="secondary" />
            </Box>
        );
    }
    if (!movie) {
        return <Typography variant="h5">Movie not found.</Typography>;
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                bgcolor: 'linear-gradient(135deg, #18181c 0%, #232526 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pb: 8,
            }}
        >
            {/* Banner Poster */}
            <Box
                sx={{
                    width: '100vw',
                    height: { xs: 220, sm: 320, md: 400 },
                    position: 'relative',
                    mb: -12,
                    overflow: 'hidden',
                }}
            >
                <img
                    src={fallbackPoster}
                    alt={movie.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.6) blur(0.5px)',
                        transition: '0.4s',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '60%',
                        background: 'linear-gradient(0deg, #18181c 80%, transparent 100%)',
                    }}
                />
            </Box>
            {/* Glass Card */}
            <Fade in timeout={600}>
                <Paper
                    elevation={6}
                    sx={{
                        maxWidth: 800,
                        width: '95vw',
                        mt: { xs: -14, sm: -18, md: -20 },
                        mb: 4,
                        p: { xs: 3, sm: 5 },
                        borderRadius: 5,
                        background: 'rgba(30,32,38,0.85)',
                        backdropFilter: 'blur(16px) saturate(120%)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                        color: '#fff',
                        position: 'relative',
                        zIndex: 2,
                        transition: '0.4s',
                    }}
                >
                    <Typography variant="h3" fontWeight={900} mb={1} letterSpacing={1} color="#fff">
                        {movie.title}
                    </Typography>
                    <Typography variant="h6" color="#e50914" mb={2} fontWeight={700}>
                        {movie.genre} | {movie.releaseYear}
                    </Typography>
                    <Divider sx={{ mb: 3, borderColor: '#fff2' }} />
                    <Typography variant="h5" fontWeight={700} mb={2}>
                        Reviews
                    </Typography>
                    <Stack spacing={2} mb={4}>
                        {(movie.reviews || []).length === 0 && <Typography>No reviews yet.</Typography>}
                        {(movie.reviews || []).map((review: Review) => (
                            <Paper key={review._id} sx={{ p: 2, borderRadius: 2, bgcolor: '#232526', color: '#fff', boxShadow: '0 2px 12px #e5091422' }}>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Avatar sx={{ bgcolor: '#e50914', mr: 1 }}>{review.reviewer[0]?.toUpperCase()}</Avatar>
                                    <Typography fontWeight={700}>{review.reviewer}</Typography>
                                    <Typography ml={2} color="#ffe066" fontWeight={700}>★ {review.rating}</Typography>
                                </Box>
                                <Typography color="#b2b2b2">{review.comment}</Typography>
                            </Paper>
                        ))}
                    </Stack>
                    <Divider sx={{ mb: 3, borderColor: '#fff2' }} />
                    <Typography variant="h5" fontWeight={700} mb={2}>
                        Add a Review
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    <form onSubmit={handleAddReview}>
                        <Stack spacing={2}>
                            <Box display="flex" alignItems="center">
                                <Typography mr={2}>Rating:</Typography>
                                <input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={rating}
                                    onChange={e => setRating(Number(e.target.value))}
                                    style={{ width: 60, fontSize: 18, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
                                    required
                                />
                            </Box>
                            <textarea
                                placeholder="Write your review..."
                                value={reviewText}
                                onChange={e => setReviewText(e.target.value)}
                                rows={3}
                                style={{ width: '100%', fontSize: 16, padding: 8, borderRadius: 4, border: '1px solid #ccc', background: '#232526', color: '#fff' }}
                                required
                            />
                            <Button type="submit" variant="contained" color="primary" disabled={submitting} sx={{ fontWeight: 700, fontSize: 18, borderRadius: 2 }}>
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Fade>
        </Box>
    );
};

export default MovieDetailsPage; 