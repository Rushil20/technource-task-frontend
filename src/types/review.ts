export interface Review {
    _id: string;
    movieId: string;
    reviewer: string;
    rating: number;
    comment?: string;
    createdAt: string;
} 