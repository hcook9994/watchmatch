import z from "zod";
import pool from "../postgres.js";
import psqlHelper from "./psqlHelper.js";

const zWatchInfo = z.object({
  movie_link_id: z.number(), //unique link between
  star_rating: z.number(),
  watch_date: z.date().nullable(), //TODO: consider making not optional
  text_review: z.string().nullable(), // define specific validation for email
  created_at: z.date(),
});

type WatchInfo = z.infer<typeof zWatchInfo>;

const zWatchInfoList = z.array(zWatchInfo);

// Create a new watch info
const createWatchInfo = async (input: {
  movieLinkId: number;
  starRating: number;
  watchDate?: Date | undefined;
  textReview?: string | undefined;
}) => {
  try {
    const insertWatchInfo =
      "INSERT INTO watch_info (movie_link_id, star_rating, watch_date, text_review) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(insertWatchInfo, [
      input.movieLinkId,
      input.starRating,
      input.watchDate,
      input.textReview,
    ]);
    const createdWatchInfo = result.rows[0];
    console.log("Watch info created:", createdWatchInfo);
  } catch (err) {
    console.error("Error creating watch info:", err);
    throw err;
  }
};

// Update existing watch info
const updateWatchInfo = async (input: {
  movieLinkId: number;
  starRating: number;
  watchDate?: Date | undefined;
  textReview?: string | undefined;
}) => {
  const query = `
    UPDATE watch_info
    SET
      star_rating = $2,
      watch_date = $3,
      text_review = $4
    WHERE
      movie_link_id = $1
    RETURNING *;
  `;

  const values = [
    input.movieLinkId,
    input.starRating,
    input.watchDate ?? null,
    input.textReview ?? null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0]; // updated row
};

// Retrieve watch info by movie link id
const getWatchInfoByMovieLinkId = async (
  movieLinkId: number
): Promise<WatchInfo | null> => {
  try {
    const getWatchInfoQuery =
      "SELECT * FROM watch_info WHERE movie_link_id = $1";
    const result = await pool.query(getWatchInfoQuery, [movieLinkId]);

    return psqlHelper.handleSinglePSQLQueryOutput({
      result,
      zodvalidator: zWatchInfo,
      datatype: "Watch Info",
    });
  } catch (err) {
    console.error("Error retrieving watch info:", err);
    throw err;
  }
};

export default {
  createWatchInfo,
  updateWatchInfo,
  getWatchInfoByMovieLinkId,
};
