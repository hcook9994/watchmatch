import movieLinkDBController from "../database/movieLink.js";
import watchInfoDBController from "../database/watchInfo.js";
import watchlistDBController from "../database/watchlist.js";
import tmdbConnector from "../connectors/tmdb.js";
import type { MovieDeepInfo } from "../types/tmdb.js";

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

export type DiaryInfo = {
  tmdbInfo: MovieDeepInfo;
  internal: {
    starRating: number;
    textReview?: string | null;
    watchDate?: Date | null;
  };
};

//TODO: define return type
async function getAllMovieLinkInfo(input: {
  userId: number;
  tmdbMovieId: number;
}): Promise<MovieLinkInfo> {
  const movieLink = await movieLinkDBController.getMovieLinkByTmdbIdAndUserId({
    tmdbMovieId: input.tmdbMovieId,
    userId: input.userId,
  });
  if (movieLink) {
    const movieInfo = await watchInfoDBController.getWatchInfoByMovieLinkId(
      movieLink.movie_link_id
    );
    const watchlist = await watchlistDBController.getWatchlistByMovieLinkId(
      movieLink.movie_link_id
    );
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
async function movieReviewHelper(input: {
  userId: number;
  tmdbMovieId: number;
  starRating: number;
  watchDate?: Date;
  textReview?: string;
}) {
  // Check if a movie link exists for this user
  let movieLink = await movieLinkDBController.getMovieLinkByTmdbIdAndUserId({
    userId: input.userId,
    tmdbMovieId: input.tmdbMovieId,
  });
  // Check if movie link exists, if not then create movie link AND info
  if (movieLink) {
    // Check if review already exists
    const movieInfo = await watchInfoDBController.getWatchInfoByMovieLinkId(
      movieLink.movie_link_id
    );
    // If review exists, edit, else create
    if (movieInfo) {
      // Edit existing watch info
      await watchInfoDBController.updateWatchInfo({
        movieLinkId: movieLink.movie_link_id,
        starRating: input.starRating,
        watchDate: input.watchDate,
        textReview: input.textReview,
      });
    } else {
      // Create new watch info
      await watchInfoDBController.createWatchInfo({
        movieLinkId: movieLink.movie_link_id,
        starRating: input.starRating,
        watchDate: input.watchDate,
        textReview: input.textReview,
      });
    }
  } else {
    // Create new movie link
    movieLink = await movieLinkDBController.createMovieLink({
      tmdbMovieId: input.tmdbMovieId,
      userId: input.userId,
    });
    // Create new watch info
    await watchInfoDBController.createWatchInfo({
      movieLinkId: movieLink.movie_link_id,
      starRating: input.starRating,
      textReview: input.textReview,
      watchDate: input.watchDate,
    });
  }
}

async function watchlistHelper(input: {
  userId: number;
  tmdbMovieId: number;
  toWatch: boolean;
}) {
  const { userId, tmdbMovieId, toWatch } = input;

  let movieLink = await movieLinkDBController.getMovieLinkByTmdbIdAndUserId({
    userId,
    tmdbMovieId,
  });

  // If no movie link exists
  if (!movieLink) {
    if (!toWatch) return; // already not on watchlist

    movieLink = await movieLinkDBController.createMovieLink({
      userId,
      tmdbMovieId,
    });

    await watchlistDBController.createWatchListDB(movieLink.movie_link_id);
    return;
  }

  const watchlist = await watchlistDBController.getWatchlistByMovieLinkId(
    movieLink.movie_link_id
  );

  const isOnWatchlist = watchlist !== null;

  // Desired state already matches DB state
  if (isOnWatchlist === toWatch) return;

  if (toWatch) {
    await watchlistDBController.createWatchListDB(movieLink.movie_link_id);
  } else {
    await watchlistDBController.deleteWatchListDB(movieLink.movie_link_id);
  }
}

async function getWatchListInfoByUserId(
  userId: number
): Promise<MovieDeepInfo[]> {
  const movieLinkList = await movieLinkDBController.getMovieLinksByUserId(
    userId
  );
  let watchlistList: MovieDeepInfo[] = [];
  if (movieLinkList)
    for (const movieLink of movieLinkList) {
      const movieLinkId = movieLink.movie_link_id;
      const watchlist = await watchlistDBController.getWatchlistByMovieLinkId(
        movieLinkId
      );
      if (watchlist !== null) {
        const movieInfo = await tmdbConnector.getMovieInfo(
          movieLink.tmdb_movie_id
        );
        if (movieInfo) {
          watchlistList.push(movieInfo);
        } else {
          console.error(
            `Can't find tmdb info for movie: ${movieLink.tmdb_movie_id}`
          );
        }
      }
    }
  return watchlistList;
}

async function getDiaryByUserId(userId: number): Promise<DiaryInfo[]> {
  const movieLinkList = await movieLinkDBController.getMovieLinksByUserId(
    userId
  );
  let diaryInfoList: DiaryInfo[] = [];
  if (movieLinkList)
    for (const movieLink of movieLinkList) {
      const movieLinkId = movieLink.movie_link_id;
      const watchInfo = await watchInfoDBController.getWatchInfoByMovieLinkId(
        movieLinkId
      );
      if (watchInfo !== null) {
        const movieInfo = await tmdbConnector.getMovieInfo(
          movieLink.tmdb_movie_id
        );
        if (movieInfo) {
          diaryInfoList.push({
            tmdbInfo: movieInfo,
            internal: {
              starRating: watchInfo.star_rating,
              textReview: watchInfo.text_review,
              watchDate: watchInfo.watch_date,
            },
          });
        } else {
          console.error(
            `Can't find tmdb info for movie: ${movieLink.tmdb_movie_id}`
          );
        }
      }
    }
  return diaryInfoList;
}

export default {
  getAllMovieLinkInfo,
  movieReviewHelper,
  watchlistHelper,
  getWatchListInfoByUserId,
  getDiaryByUserId,
};
