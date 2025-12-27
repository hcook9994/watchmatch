import z from "zod";
import pool from "../postgres.js";

const zWatchlistInfo = z.object({
  movie_link_id: z.number(),
  created_at: z.date(),
});

type Watchlist = z.infer<typeof zWatchlistInfo>;

// Create a new watch list
export const createWatchListDB = async (movieLinkId: number) => {
  try {
    const insertWatchList =
      "INSERT INTO watch_list (movie_link_id) VALUES ($1) RETURNING *";
    const result = await pool.query(insertWatchList, [movieLinkId]);
    const createdWatchlist = result.rows[0];
    console.log("watch list created:", createdWatchlist);
  } catch (err) {
    console.error("Error creating watch list:", err);
    throw err;
  }
};

// Delete existing watch list
export const deleteWatchListDB = async (movieLinkId: number) => {
  const query = "DELETE FROM watch_list WHERE movie_link_id = $1";

  const values = [movieLinkId];
  await pool.query(query, values);
  return;
};

// Retrieve watch list by movie link id
export const getWatchlistByMovieLinkId = async (
  movieLinkId: number
): Promise<Watchlist | null> => {
  try {
    const getWatchlistQuery =
      "SELECT * FROM watch_list WHERE movie_link_id = $1";
    const result = await pool.query(getWatchlistQuery, [movieLinkId]);

    if (result.rows.length === 0) {
      console.log("Watch list not found");
      return null;
    } else if (result.rows.length > 1) {
      console.warn("Multiple watch lists found with the same watch listname");
    }

    const parsed = zWatchlistInfo.safeParse(result.rows[0]);
    if (!parsed.success) {
      console.error(
        "Watch list from database failed validation:",
        parsed.error
      );
      return null;
    }
    const validatedWatchlist = parsed.data;

    return validatedWatchlist;
  } catch (err) {
    console.error("Error retrieving watch list:", err);
    throw err;
  }
};
