import z from "zod";
import pool from "../postgres.js";
import type { QueryResult } from "pg";

const zMovieLink = z.object({
  movie_link_id: z.number(), //unique link between movie and user
  tmdb_movie_id: z.number(), //link to tmdb external database
  //TODO: consider omdb id also?
  user_id: z.number(),
  created_at: z.date(),
});

type MovieLink = z.infer<typeof zMovieLink>;

// Create a movie link
export const createMovieLink = async (input: {
  tmdbMovieId: number;
  userId: number;
}): Promise<MovieLink> => {
  try {
    const insertUser =
      "INSERT INTO movie_link (tmdb_movie_id, user_id) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(insertUser, [
      input.tmdbMovieId,
      input.userId,
    ]);
    const createdMovieLink = result.rows[0];
    console.log("User created:", createdMovieLink);
    return createdMovieLink;
  } catch (err) {
    console.error("Error creating movie link:", err);
    throw err;
  }
};

// Retrieve movie link by linkId
export const getMovieLinkByLinkId = async (
  movieLinkId: number
): Promise<MovieLink | null> => {
  try {
    const getMovieLinkQuery =
      "SELECT * FROM movie_link WHERE movie_link_id = $1";
    const result = await pool.query(getMovieLinkQuery, [movieLinkId]);
    return handlePSQLQueryOutput(result);
  } catch (err) {
    console.error("Error retrieving user:", err);
    throw err;
  }
};

// Retrieve movie link by linkId
export const getMovieLinkByTmdbIdAndUserId = async (input: {
  tmdbMovieId: number;
  userId: number;
}): Promise<MovieLink | null> => {
  try {
    const getMovieLinkQuery =
      "SELECT * FROM movie_link WHERE tmdb_movie_id = $1 AND user_id = $2";
    const result = await pool.query(getMovieLinkQuery, [
      input.tmdbMovieId,
      input.userId,
    ]);
    return handlePSQLQueryOutput(result);
  } catch (err) {
    console.error("Error retrieving user:", err);
    throw err;
  }
};

// PSQL Query handling
function handlePSQLQueryOutput(result: QueryResult<any>) {
  if (result.rows.length === 0) {
    console.log("Movie Link not found");
    return null;
  } else if (result.rows.length > 1) {
    console.warn("Multiple movie links found with the same link id");
    throw Error;
  }

  const parsed = zMovieLink.safeParse(result.rows[0]);
  if (!parsed.success) {
    console.error("Movie Link from database failed validation:", parsed.error);
    return null;
  }
  const validatedMovieLink = parsed.data;

  return validatedMovieLink;
}
