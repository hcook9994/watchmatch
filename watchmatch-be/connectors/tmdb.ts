import z from "zod";
import { tmdbAccessToken, tmdbAPIKey } from "../tmdb.js";
import {
  zMovieApiResult,
  zMovieDeepInfo,
  type Movie,
  type MovieDeepInfo,
} from "../types/tmdb.js";

//TODO: move these types into their own files

async function popularMoviesQuery(): Promise<Movie[] | null> {
  const popularMovieApiResp = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbAPIKey}`
  );
  const validatedApiResponse = await validateApiResponse(
    popularMovieApiResp,
    zMovieApiResult
  );
  if (validatedApiResponse) {
    return validatedApiResponse?.results;
  }
  console.error("popularMoviesQuery tmdb api failed");
  return null;
}

async function searchMovieString(
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
  const validatedApiResponse = await validateApiResponse(
    searchMovieApiResp,
    zMovieApiResult
  );
  if (validatedApiResponse) {
    return validatedApiResponse?.results;
  }
  console.error("searchMovieString tmdb api failed");
  return null;
}

async function getMovieInfo(
  tmdbMovieId: number
): Promise<MovieDeepInfo | null> {
  const getMovieApiResp = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbMovieId}?language=en-US`,
    {
      headers: {
        Authorization: `Bearer ${tmdbAccessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return validateApiResponse(getMovieApiResp, zMovieDeepInfo);
}

async function validateApiResponse<T>(
  apiResponse: Response,
  zodValidator: z.ZodType<T>
): Promise<T | null> {
  const jsonApiResponse = await apiResponse.json();
  const validatedApiResponse = zodValidator.safeParse(jsonApiResponse);
  if (!validatedApiResponse.success) {
    console.error("Api type failed validation:", validatedApiResponse.error);
    return null;
  }
  const validatedResponse = validatedApiResponse.data;
  return validatedResponse;
}

export default {
  popularMoviesQuery,
  searchMovieString,
  getMovieInfo,
};
