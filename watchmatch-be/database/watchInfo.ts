import z from "zod";
import pool from "../postgres.js";

const zWatchInfo = z.object({
  movie_link_id: z.number(), //unique link between
  star_rating: z.number(),
  watch_date: z.date().nullable(), //TODO: consider making not optional
  text_review: z.string().nullable(), // define specific validation for email
  created_at: z.date(),
});

type WatchInfo = z.infer<typeof zWatchInfo>;

// Create a new watch info
export const createWatchInfo = async (input: {
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
export const updateWatchInfo = async (input: {
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
export const getWatchInfoByMovieLinkId = async (
  movieLinkId: number
): Promise<WatchInfo | null> => {
  try {
    const getWatchInfoQuery =
      "SELECT * FROM watch_info WHERE movie_link_id = $1";
    const result = await pool.query(getWatchInfoQuery, [movieLinkId]);

    if (result.rows.length === 0) {
      console.log("Watch Info not found");
      return null;
    } else if (result.rows.length > 1) {
      console.warn("Multiple watch infos found with the same movie link id");
    }

    const parsed = zWatchInfo.safeParse(result.rows[0]);
    if (!parsed.success) {
      console.error(
        "Watch info from database failed validation:",
        parsed.error
      );
      return null;
    }
    const validatedWatchInfo = parsed.data;

    return validatedWatchInfo;
  } catch (err) {
    console.error("Error retrieving watch info:", err);
    throw err;
  }
};
