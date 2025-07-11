import type { Review } from './review';

export interface Movie {
    _id: string;
    title: string;
    genre: string;
    releaseYear: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    __v?: number;
}

export interface MovieWithRating extends Movie {
    averageRating?: number;
    reviews?: Review[];
} 