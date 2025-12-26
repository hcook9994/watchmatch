import z from "zod";
import { tmdbAccessToken, tmdbAPIKey } from "../tmdb.js";

//TODO: move these types into their own files

export const zMovie = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(), // TMDB can return null
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(), // can be null
  release_date: z.string(), // ISO date string (YYYY-MM-DD)
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export type Movie = z.infer<typeof zMovie>;

export const zMovieApiResult = z.array(zMovie);

export async function popularMoviesQuery(): Promise<Movie[] | null> {
  const popularMovieApiResp = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbAPIKey}`
  );
  const movieResponse = await popularMovieApiResp.json();
  const validatedMovieList = zMovieApiResult.safeParse(movieResponse.results);
  if (!validatedMovieList.success) {
    console.error(
      "User from database failed validation:",
      validatedMovieList.error
    );
    return null;
  }
  const validatedResponse = validatedMovieList.data;
  return validatedResponse;
}

export async function searchMovieString(
  searchString: string
): Promise<Movie[] | null> {
  const searchMovieApiResp = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${searchString}&include_adult=false&language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${tmdbAccessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const searchResponse = await searchMovieApiResp.json();
  const validatedSearchResponse = zMovieApiResult.safeParse(
    searchResponse.results
  );
  if (!validatedSearchResponse.success) {
    console.error(
      "User from database failed validation:",
      validatedSearchResponse.error
    );
    return null;
  }
  const validatedResponse = validatedSearchResponse.data;
  return validatedResponse;
}

//TODO: consider exporting a class and calling the function like that
