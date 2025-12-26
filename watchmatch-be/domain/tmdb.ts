import {
  popularMoviesQuery,
  searchMovieString,
  type Movie,
} from "../connectors/tmdb.js";

export async function getPopularMovies(): Promise<Movie[] | null> {
  const tmdbPopularMovies = await popularMoviesQuery();

  return tmdbPopularMovies;
}

export async function searchMovie(searchString: string) {
  const tmdbMovieSearch = await searchMovieString(searchString);

  return tmdbMovieSearch;
}
