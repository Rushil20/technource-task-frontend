# Movie Review System - Frontend

This is the frontend for the Movie Review System, built with React, TypeScript, Vite, and Material-UI (MUI).

## Tech Stack
- React + TypeScript (Vite)
- Material-UI (MUI)
- React Router
- Axios

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173) to view the app.

## Project Structure (Recommended)

```
src/
  components/      # Reusable UI components (MovieCard, Pagination, etc.)
  pages/           # Page components (MovieListPage, MovieDetailsPage)
  api/             # API utility functions (movies.ts, reviews.ts)
  types/           # TypeScript types/interfaces
  App.tsx          # Main app component with routes
  main.tsx         # Entry point
```

## Features (to be implemented)
- Movie grid with filtering, sorting, and pagination
- Movie details page with reviews
- Add new review form

---

For backend setup, see the backend/README.md (to be created).
