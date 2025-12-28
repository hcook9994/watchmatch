import z from "zod";
import pool from "../postgres.js";
import psqlHelper from "./psqlHelper.js";

//TODO: consolidate watchlist as one word

const zWatchlist = z.object({
  movie_link_id: z.number(),
  created_at: z.date(),
});

export type Watchlist = z.infer<typeof zWatchlist>;

const zWatchlistList = z.array(zWatchlist);

// Create a new watch list
const createWatchListDB = async (movieLinkId: number) => {
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
const deleteWatchListDB = async (movieLinkId: number) => {
  const query = "DELETE FROM watch_list WHERE movie_link_id = $1";

  const values = [movieLinkId];
  await pool.query(query, values);
  return;
};

// Retrieve watch list by movie link id
const getWatchlistByMovieLinkId = async (
  movieLinkId: number
): Promise<Watchlist | null> => {
  try {
    const getWatchlistQuery =
      "SELECT * FROM watch_list WHERE movie_link_id = $1";
    const result = await pool.query(getWatchlistQuery, [movieLinkId]);

    return psqlHelper.handleSinglePSQLQueryOutput({
      result,
      zodvalidator: zWatchlist,
      datatype: "Watch List",
    });
  } catch (err) {
    console.error("Error retrieving watch list:", err);
    throw err;
  }
};

// Retrieve watch list by movie link id
const getWatchlistByUserId = async (
  userId: number
): Promise<Watchlist[] | null> => {
  try {
    const getWatchlistQuery = "SELECT * FROM watch_list WHERE user_id = $1";
    const result = await pool.query(getWatchlistQuery, [userId]);

    return psqlHelper.handleMultiplePSQLQueryOutput({
      result,
      zodvalidator: zWatchlistList,
      datatype: "Watch List",
    });
  } catch (err) {
    console.error("Error retrieving watch list:", err);
    throw err;
  }
};

export default {
  createWatchListDB,
  deleteWatchListDB,
  getWatchlistByMovieLinkId,
  getWatchlistByUserId,
};
