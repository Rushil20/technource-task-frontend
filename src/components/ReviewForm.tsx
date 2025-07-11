import React, { useState } from 'react';
import { Box, TextField, Button, Rating, Typography, Stack } from '@mui/material';

interface ReviewFormProps {
    onSubmit: (data: { reviewer: string; rating: number; comment?: string }) => void;
    loading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, loading }) => {
    const [reviewer, setReviewer] = useState('');
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewer.trim() || !rating) {
            setError('Reviewer name and rating are required.');
            return;
        }
        setError('');
        onSubmit({ reviewer, rating, comment });
        setReviewer('');
        setRating(null);
        setComment('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} mt={2}>
            <Stack spacing={2}>
                <Typography variant="h6">Add a Review</Typography>
                <TextField
                    label="Your Name"
                    value={reviewer}
                    onChange={e => setReviewer(e.target.value)}
                    required
                    size="small"
                />
                <Box display="flex" alignItems="center">
                    <Typography mr={2}>Rating:</Typography>
                    <Rating
                        value={rating}
                        onChange={(_, value) => setRating(value)}
                        size="large"
                        max={5}
                    />
                </Box>
                <TextField
                    label="Comment (optional)"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    multiline
                    minRows={2}
                    size="small"
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                </Button>
            </Stack>
        </Box>
    );
};

export default ReviewForm; 