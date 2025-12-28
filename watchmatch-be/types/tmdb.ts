import z from "zod";

const zMovie = z.object({
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

export const zMovieApiResult = z.object({
  results: z.array(zMovie),
});

const zGenre = z.object({
  id: z.number(),
  name: z.string(),
});

const zProductionCompany = z.object({
  id: z.number(),
  logo_path: z.string().nullable(),
  name: z.string(),
  origin_country: z.string(),
});

const zProductionCountry = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
});

const zSpokenLanguage = z.object({
  english_name: z.string(),
  iso_639_1: z.string(),
  name: z.string(),
});

const zCollection = z.object({
  id: z.number(),
  name: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
});

export const zMovieDeepInfo = z.object({
  adult: z.boolean(),
  backdrop_path: z.string(),
  belongs_to_collection: zCollection.nullable(), // can be changed if sometimes an object
  budget: z.number(),
  genres: z.array(zGenre),
  homepage: z.string(), //note this is sometimes a valid url but not always
  id: z.number(),
  imdb_id: z.string(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  production_companies: z.array(zProductionCompany),
  production_countries: z.array(zProductionCountry),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  spoken_languages: z.array(zSpokenLanguage),
  status: z.string(),
  tagline: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

// Type inferred automatically:
export type MovieDeepInfo = z.infer<typeof zMovieDeepInfo>;
