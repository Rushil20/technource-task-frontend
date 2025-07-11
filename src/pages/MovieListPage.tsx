import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Fab,
  Card,
  CardContent,
  CardActions,
  Divider,
  Stack,
  Tooltip,
  Fade,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import type { MovieWithRating } from '../types/movie';
// import type { Review } from '../types/review';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';

// Google Fonts import (Montserrat)
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;500;400&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

document.body.style.margin = '0';
document.body.style.fontFamily = "'Montserrat', sans-serif";

addNetflixStyles();
function addNetflixStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
    body {
      background: linear-gradient(135deg, #18181c 0%, #232526 100%) !important;
    }
    .netflix-bg {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      z-index: -2;
      background: linear-gradient(135deg, #18181c 0%, #232526 100%);
      overflow: hidden;
    }
    .netflix-bg::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: repeating-linear-gradient(120deg, rgba(255,255,255,0.01) 0 2px, transparent 2px 40px);
      opacity: 0.2;
      pointer-events: none;
      animation: bgmove 12s linear infinite;
    }
    @keyframes bgmove {
      0% { background-position: 0 0; }
      100% { background-position: 200px 200px; }
    }
    .netflix-card {
      position: relative;
      background: rgba(30, 32, 38, 0.7);
      backdrop-filter: blur(16px) saturate(120%);
      border-radius: 24px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
      overflow: visible;
      transition: transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s;
      border: none;
      min-height: 420px;
      margin-bottom: 16px;
    }
    .netflix-card:hover {
      transform: scale(1.045) translateY(-8px);
      box-shadow: 0 16px 48px 0 #e5091433, 0 2px 16px 0 #000a;
      z-index: 2;
    }
    .netflix-poster {
      width: 100%;
      height: 260px;
      object-fit: cover;
      border-radius: 24px 24px 0 0;
      position: relative;
      z-index: 1;
      box-shadow: 0 4px 24px 0 #0008;
    }
    .netflix-poster-gradient {
      position: absolute;
      left: 0; right: 0; bottom: 0; height: 90px;
      border-radius: 0 0 24px 24px;
      background: linear-gradient(0deg, #18181c 90%, transparent 100%);
      z-index: 2;
      pointer-events: none;
    }
    .netflix-accent {
      position: absolute;
      left: 0; top: 32px; bottom: 32px;
      width: 6px;
      border-radius: 8px;
      background: linear-gradient(180deg, #e50914 0%, #b81d24 100%);
      z-index: 3;
      box-shadow: 0 0 12px 2px #e5091444;
    }
    .netflix-card-content {
      position: relative;
      z-index: 3;
      margin-top: -60px;
      padding-top: 0;
      padding-bottom: 0;
      background: none;
    }
    .netflix-fadein {
      opacity: 0;
      transform: translateY(40px);
      animation: fadeinup 0.7s cubic-bezier(.4,2,.6,1) forwards;
    }
    @keyframes fadeinup {
      to { opacity: 1; transform: none; }
    }
    .glow-fab {
      box-shadow: 0 0 16px 4px #e5091499, 0 2px 8px 0 #0008;
      animation: glow 2s infinite alternate;
    }
    @keyframes glow {
      from { box-shadow: 0 0 16px 4px #e5091499, 0 2px 8px 0 #0008; }
      to { box-shadow: 0 0 32px 8px #e50914cc, 0 2px 16px 0 #000a; }
    }
  `;
  document.head.appendChild(style);
}

const API_BASE = 'http://localhost:3000';

const MOVIES_PER_PAGE = 8;

const MovieListPage: React.FC = () => {
  const [movies, setMovies] = React.useState<MovieWithRating[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();

  const [total, setTotal] = React.useState(0);
  React.useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: MOVIES_PER_PAGE,
        };
        if (search) params.search = search;
        const moviesRes = await axios.get(`${API_BASE}/movies`, { params });
        // Expecting { data: [...], total: number }
        const moviesData: MovieWithRating[] = moviesRes.data.data || moviesRes.data;
        setMovies(moviesData);
        setTotal(moviesRes.data.total || moviesData.length);
      } catch (err) {
        setMovies([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [search, page]);

  React.useEffect(() => {
    // Animate cards on mount
    const cards = document.querySelectorAll('.netflix-fadein');
    cards.forEach((card, i) => {
      (card as HTMLElement).style.animationDelay = `${i * 0.08 + 0.2}s`;
    });
  }, [movies]);

  // Fallback poster
  const fallbackPoster = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80';

  const pageCount = Math.ceil(total / MOVIES_PER_PAGE);

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, sans-serif', position: 'relative', overflowX: 'hidden' }}>
      <div className="netflix-bg" />
      {/* Top Navigation Bar */}
      <AppBar position="sticky" color="transparent" elevation={0} sx={{
        background: 'linear-gradient(90deg, #18181c 60%, #232526 100%)',
        boxShadow: '0 2px 16px 0 #0008',
        backdropFilter: 'blur(8px)',
        borderBottom: '1.5px solid #2226',
      }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: 1, color: '#fff', fontSize: 32 }}>
            Movies
          </Typography>
          <IconButton color="inherit" edge="end" sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: '#232526', width: 44, height: 44, border: '2.5px solid #e50914', transition: '0.2s', '&:hover': { boxShadow: '0 0 0 6px #e5091444' } }}>
              <AccountCircleIcon fontSize="large" />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Search Bar */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
        <TextField
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search movies..."
          variant="outlined"
          sx={{
            width: { xs: '90%', sm: 400 },
            background: 'rgba(30,32,38,0.85)',
            borderRadius: 3,
            input: { color: '#fff', fontWeight: 700, fontSize: 18 },
            fieldset: { borderColor: '#e50914' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#e50914' },
              '&:hover fieldset': { borderColor: '#e50914' },
              '&.Mui-focused fieldset': { borderColor: '#e50914' },
            },
          }}
          InputProps={{ style: { color: '#fff' } }}
          InputLabelProps={{ style: { color: '#b2b2b2' } }}
        />
      </Box>

      {/* Main Content - Full Width */}
      <Box sx={{ width: '100vw', px: { xs: 2, sm: 4, md: 8 }, pt: 6, pb: 8, mx: 'auto' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
            {movies.map((movie, idx) => (
              <Grid key={movie._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ height: '100%' }}>
                <Fade in timeout={700 + idx * 100}>
                  <Card
                    className="netflix-card netflix-fadein"
                    onClick={() => navigate(`/movies/${movie._id}`)}
                    sx={{
                      borderRadius: 4,
                      minHeight: 500,
                      maxHeight: 500,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      transition: '0.2s',
                      overflow: 'visible',
                      cursor: 'pointer',
                      color: '#fff',
                      background: 'rgba(30,32,38,0.7)',
                      position: 'relative',
                    }}
                  >
                    <div className="netflix-accent" />
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={fallbackPoster}
                        alt={movie.title}
                        className="netflix-poster"
                        style={{ marginBottom: 0, height: 220, minHeight: 220, maxHeight: 220 }}
                      />
                      <div className="netflix-poster-gradient" />
                    </Box>
                    <CardContent
                      className="netflix-card-content"
                      sx={{
                        pb: 1,
                        pt: 0,
                        mt: -7,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 900, fontSize: 24, mb: 0.5, color: '#fff', letterSpacing: 0.5 }}>
                        {movie.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#e50914', fontWeight: 700, mb: 0.5, fontSize: 15 }}>
                        {movie.genre} | {movie.releaseYear}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <span style={{ color: '#ffe066', fontWeight: 700, fontSize: 20 }}>★</span>
                        <Typography variant="body2" sx={{ color: '#ffe066', fontWeight: 700, fontSize: 18 }}>
                          {movie.averageRating?.toFixed(1) ?? 'N/A'}
                        </Typography>
                      </Stack>
                      <Divider sx={{ borderColor: '#fff2', mb: 1 }} />
                      <Typography variant="subtitle2" color="#b2b2b2" gutterBottom sx={{ fontWeight: 700, fontSize: 15 }}>
                        Recent Reviews
                      </Typography>
                      <Stack spacing={1}>
                        {(movie.reviews && movie.reviews.length > 0) ? (
                          movie.reviews.slice(0, 2).map((review) => (
                            <Box key={review._id} display="flex" alignItems="center" sx={{ background: 'rgba(229,9,20,0.07)', borderRadius: 2, px: 1, py: 0.5 }}>
                              <Avatar sx={{ width: 30, height: 30, mr: 1, bgcolor: '#e50914', color: '#fff', fontWeight: 700, fontSize: 16, border: '2px solid #fff' }}>
                                {review.reviewer[0]}
                              </Avatar>
                              <Typography variant="body2" fontWeight={700} mr={1} sx={{ color: '#fff', fontSize: 15 }}>
                                {review.reviewer}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#ffe066', fontWeight: 700, fontSize: 15, ml: 1, mr: 1 }}>★ {review.rating}</Typography>
                              <Typography variant="body2" sx={{ color: '#b2b2b2', fontSize: 15 }}>{review.comment}</Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: '#b2b2b2', fontStyle: 'italic', fontSize: 14, opacity: 0.7, pl: 1 }}>
                            No reviews yet.
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', bgcolor: 'transparent', pt: 0, mt: 'auto' }}>
                      <Typography variant="caption" color="#e50914" sx={{ cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
                        View all reviews
                      </Typography>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
        {/* Pagination */}
        {!loading && pageCount > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 2,
                  background: 'rgba(30,32,38,0.7)',
                  border: '1px solid #e50914',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #e50914 0%, #232526 100%)',
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* Floating Action Button */}
      <Tooltip title="Add Movie" placement="left" arrow>
        <Fab
          color="secondary"
          aria-label="add"
          className="glow-fab"
          sx={{ position: 'fixed', bottom: 32, right: 32, background: 'linear-gradient(135deg, #e50914 0%, #232526 100%)', color: '#fff', fontWeight: 700, width: 64, height: 64, zIndex: 10 }}
        >
          <AddIcon fontSize="large" />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default MovieListPage; 