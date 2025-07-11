import React from 'react';
import { Card, CardContent, Typography, CardActionArea, Box, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MovieWithRating } from '../types/movie';

interface MovieCardProps {
    movie: MovieWithRating;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardActionArea onClick={() => navigate(`/movies/${movie._id}`)}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>{movie.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{movie.genre} | {movie.releaseYear}</Typography>
                    <Box mt={1} display="flex" alignItems="center">
                        <Rating value={movie.averageRating} precision={0.1} readOnly size="small" />
                        <Typography variant="caption" ml={0.5}>({movie.averageRating.toFixed(1)})</Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default MovieCard; 