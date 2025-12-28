import z from "zod";
import pool from "../postgres.js";
import psqlHelper from "./psqlHelper.js";

const zMovieLink = z.object({
  movie_link_id: z.number(), //unique link between movie and user
  tmdb_movie_id: z.number(), //link to tmdb external database
  //TODO: consider omdb id also?
  user_id: z.number(),
  created_at: z.date(),
});

type MovieLink = z.infer<typeof zMovieLink>;

const zMovieLinkList = z.array(zMovieLink);

// Create a movie link
const createMovieLink = async (input: {
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
const getMovieLinkByLinkId = async (
  movieLinkId: number
): Promise<MovieLink | null> => {
  try {
    const getMovieLinkQuery =
      "SELECT * FROM movie_link WHERE movie_link_id = $1";
    const result = await pool.query(getMovieLinkQuery, [movieLinkId]);
    return psqlHelper.handleSinglePSQLQueryOutput({
      result,
      zodvalidator: zMovieLink,
      datatype: "Movie Link",
    });
  } catch (err) {
    console.error("Error retrieving user:", err);
    throw err;
  }
};

// Retrieve movie link by linkId
const getMovieLinkByTmdbIdAndUserId = async (input: {
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
    return psqlHelper.handleSinglePSQLQueryOutput({
      result,
      zodvalidator: zMovieLink,
      datatype: "Movie Link",
    });
  } catch (err) {
    console.error("Error retrieving user:", err);
    throw err;
  }
};

// Retrieve movie link by linkId
const getMovieLinksByUserId = async (
  userId: number
): Promise<MovieLink[] | null> => {
  try {
    const getMovieLinkQuery = "SELECT * FROM movie_link WHERE user_id = $1 ";
    const result = await pool.query(getMovieLinkQuery, [userId]);
    return psqlHelper.handleMultiplePSQLQueryOutput({
      result,
      zodvalidator: zMovieLinkList,
      datatype: "Movie Link",
    });
  } catch (err) {
    console.error("Error retrieving user:", err);
    throw err;
  }
};

//TODO: need to improve this so I can command click
export default {
  createMovieLink,
  getMovieLinkByLinkId,
  getMovieLinkByTmdbIdAndUserId,
  getMovieLinksByUserId,
};
