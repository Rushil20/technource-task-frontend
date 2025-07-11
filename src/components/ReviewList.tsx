import React from 'react';
import { List, ListItem, ListItemText, Typography, Box, Rating } from '@mui/material';
import type { Review } from '../types/review';

interface ReviewListProps {
    reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    if (reviews.length === 0) {
        return <Typography>No reviews yet.</Typography>;
    }
    return (
        <List>
            {reviews.map((review) => (
                <ListItem key={review._id} alignItems="flex-start" divider>
                    <ListItemText
                        primary={
                            <Box display="flex" alignItems="center">
                                <Typography fontWeight="bold" mr={1}>{review.reviewer}</Typography>
                                <Rating value={review.rating} readOnly size="small" />
                                <Typography variant="caption" ml={1}>{new Date(review.createdAt).toLocaleDateString()}</Typography>
                            </Box>
                        }
                        secondary={review.comment}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default ReviewList; 