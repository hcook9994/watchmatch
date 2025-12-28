import tmdbConnector, { type Movie } from "../connectors/tmdb.js";

async function getPopularMovies(): Promise<Movie[] | null> {
  const tmdbPopularMovies = await tmdbConnector.popularMoviesQuery();

  return tmdbPopularMovies;
}

async function searchMovie(searchString: string) {
  const tmdbMovieSearch = await tmdbConnector.searchMovieString(searchString);

  return tmdbMovieSearch;
}

export default {
  getPopularMovies,
  searchMovie,
};
