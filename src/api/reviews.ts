import axios from 'axios';
import { Review } from '../types/review';

const API_BASE = 'http://localhost:3000'; // Update if backend runs elsewhere

export async function fetchReviews(movieId: string): Promise<Review[]> {
    const res = await axios.get(`${API_BASE}/reviews/${movieId}`);
    return res.data;
}

export interface AddReviewPayload {
    movieId: string;
    reviewer: string;
    rating: number;
    comment?: string;
}

export async function addReview(payload: AddReviewPayload): Promise<Review> {
    const res = await axios.post(`${API_BASE}/reviews`, payload);
    return res.data;
} 