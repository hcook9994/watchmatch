import {
  createMovieLink,
  getMovieLinkByTmdbIdAndUserId,
} from "../database/movieLink.js";
import {
  createWatchInfo,
  getWatchInfoByMovieLinkId,
  updateWatchInfo,
} from "../database/watchInfo.js";
import {
  createWatchListDB,
  deleteWatchListDB,
  getWatchlistByMovieLinkId,
} from "../database/watchList.js";

// TODO: I should need this undefined nonsense?
// Can I use zod?
export type MovieLinkInfo = {
  status:
    | "WATCHLISTANDREVIEWED"
    | "REVIEWED"
    | "WATCHLIST"
    | "LINKEDONLY"
    | "NOLINK";
  starRating?: number | undefined;
  watchDate?: Date | undefined;
  textReview?: string | undefined;
};

//TODO: define return type
export async function getAllMovieLinkInfo(input: {
  userId: number;
  tmdbMovieId: number;
}): Promise<MovieLinkInfo> {
  const movieLink = await getMovieLinkByTmdbIdAndUserId({
    tmdbMovieId: input.tmdbMovieId,
    userId: input.userId,
  });
  if (movieLink) {
    const movieInfo = await getWatchInfoByMovieLinkId(movieLink.movie_link_id);
    const watchlist = await getWatchlistByMovieLinkId(movieLink.movie_link_id);
    const status =
      movieInfo && watchlist
        ? "WATCHLISTANDREVIEWED"
        : movieInfo
        ? "REVIEWED"
        : watchlist
        ? "WATCHLIST"
        : "LINKEDONLY";
    return {
      status,
      starRating: movieInfo?.star_rating,
      watchDate: movieInfo?.watch_date ?? undefined,
      textReview: movieInfo?.text_review ?? undefined,
    };
  }
  return { status: "NOLINK" };
}

//TODO: better way to handle than having so many if else statements

// TODO: ensure movie is watched before calling this function
export async function movieReviewHelper(input: {
  userId: number;
  tmdbMovieId: number;
  starRating: number;
  watchDate?: Date;
  textReview?: string;
}) {
  // Check if a movie link exists for this user
  let movieLink = await getMovieLinkByTmdbIdAndUserId({
    userId: input.userId,
    tmdbMovieId: input.tmdbMovieId,
  });
  // Check if movie link exists, if not then create movie link AND info
  if (movieLink) {
    // Check if review already exists
    const movieInfo = await getWatchInfoByMovieLinkId(movieLink.movie_link_id);
    // If review exists, edit, else create
    if (movieInfo) {
      // Edit existing watch info
      await updateWatchInfo({
        movieLinkId: movieLink.movie_link_id,
        starRating: input.starRating,
        watchDate: input.watchDate,
        textReview: input.textReview,
      });
    } else {
      // Create new watch info
      await createWatchInfo({
        movieLinkId: movieLink.movie_link_id,
        starRating: input.starRating,
        watchDate: input.watchDate,
        textReview: input.textReview,
      });
    }
  } else {
    // Create new movie link
    movieLink = await createMovieLink({
      tmdbMovieId: input.tmdbMovieId,
      userId: input.userId,
    });
    // Create new watch info
    await createWatchInfo({
      movieLinkId: movieLink.movie_link_id,
      starRating: input.starRating,
      textReview: input.textReview,
      watchDate: input.watchDate,
    });
  }
}

export async function watchlistHelper(input: {
  userId: number;
  tmdbMovieId: number;
  toWatch: boolean;
}) {
  // Check if a movie link exists for this user
  let movieLink = await getMovieLinkByTmdbIdAndUserId({
    userId: input.userId,
    tmdbMovieId: input.tmdbMovieId,
  });
  // Check if movie link exists, if not then create movie link AND watch list
  if (movieLink) {
    // Check if watch list already exists
    const watchlist = await getWatchlistByMovieLinkId(movieLink.movie_link_id);
    // If status of watchList is the same then return with no change
    if ((watchlist && input.toWatch) || (!watchlist && !input.toWatch)) {
      //Status hasnt changed return
      return;
    } else {
      if (input.toWatch) {
      } else {
        deleteWatchListDB(movieLink.movie_link_id);
      }
    }
  } else {
    if (!input.toWatch) {
      // No need to do anything as its already not on the watchlist
      return;
    } else {
      movieLink = await createMovieLink({
        tmdbMovieId: input.tmdbMovieId,
        userId: input.userId,
      });
      createWatchListDB(movieLink.movie_link_id);
    }
  }
}
