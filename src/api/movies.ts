import axios from 'axios';
import { MovieWithRating } from '../types/movie';

const API_BASE = 'http://localhost:3000'; // Update if backend runs elsewhere

export interface FetchMoviesParams {
    genre?: string;
    releaseYear?: number;
    sortBy?: 'releaseYear' | 'averageRating';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface FetchMoviesResponse {
    movies: MovieWithRating[];
    total: number;
}

export async function fetchMovies(params: FetchMoviesParams): Promise<FetchMoviesResponse> {
    const { genre, releaseYear, sortBy, sortOrder, page = 1, limit = 12 } = params;
    const res = await axios.get(`${API_BASE}/movies`, {
        params: {
            genre,
            releaseYear,
            sortBy,
            sortOrder,
            page,
            limit,
        },
    });
    return res.data;
}

export async function fetchMovieById(id: string): Promise<MovieWithRating> {
    const res = await axios.get(`${API_BASE}/movies/${id}`);
    return res.data;
} 