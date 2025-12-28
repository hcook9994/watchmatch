// TODO: reformat these functions
// TODO: add proper return types
// TODO: remove duplicated code
// TODO: make a controller
import { DiaryInfo, MovieLinkInfo } from "../../watchmatch-be/domain/movie";
import { MovieDeepInfo } from "../../watchmatch-be/types/tmdb";

export async function createUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const response = await fetch("http://localhost:3000/create_user/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    if (response.status === 200) {
      return { status: 200, data: await response.json() };
    } else {
      return { message: "The server denied our request." };
    }
  } catch (e) {
    return { message: "Failed fetching from the API" };
  }
}

//TODO: should this be a POST?
export async function login(username: string, password: string) {
  try {
    const response = await fetch("http://localhost:3000/login/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 200) {
      const responseData = await response.json();
      return { data: responseData, status: 200 };
    } else {
      return { message: "The server denied our request.", status: 500 };
    }
  } catch (e) {
    return { message: "Failed fetching from the API", status: 500 };
  }
}

export async function getPopularMovies() {
  try {
    const response = await fetch("http://localhost:3000/popular_movies/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.status === 200) {
      const responseData = await response.json();
      return { data: responseData, status: 200 };
    } else {
      return { message: "The server denied our request.", status: 500 };
    }
  } catch (e) {
    return { message: "Failed fetching from the API", status: 500 };
  }
}

export async function searchMovies(searchString: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/search_movies?search_string=${searchString}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );

    if (response.status === 200) {
      const responseData = await response.json();
      return { data: responseData, status: 200 };
    } else {
      return { message: "The server denied our request.", status: 500 };
    }
  } catch (e) {
    return { message: "Failed fetching from the API", status: 500 };
  }
}

//TODO: combine watchlist and reviewMovie APIs

export async function watchlist(input: {
  tmdbMovieId: number;
  toWatch: boolean;
  userId: number;
}) {
  try {
    const response = await fetch("http://localhost:3000/watchlist/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        tmdb_movie_id: input.tmdbMovieId,
        to_watch: input.toWatch,
        user_id: input.userId,
      }),
    });

    if (response.status === 200) {
      return { status: 200, data: await response.json() };
    } else {
      return { message: "The server denied our request." };
    }
  } catch (e) {
    return { message: "Failed fetching from the API" };
  }
}

export async function reviewMovie(input: {
  starRating: number;
  tmdbMovieId: number;
  userId: number;
  textReview?: string;
  watchDate?: Date;
}) {
  try {
    const response = await fetch("http://localhost:3000/review/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        star_rating: input.starRating,
        tmdb_movie_id: input.tmdbMovieId,
        user_id: input.userId,
        text_review: input.textReview,
        watch_date: input.watchDate,
      }),
    });

    if (response.status === 200) {
      return { status: 200, data: await response.json() };
    } else {
      return { message: "The server denied our request." };
    }
  } catch (e) {
    return { message: "Failed fetching from the API" };
  }
}

export async function getMovieLinkInfo(input: {
  tmdbMovieId: number;
  userId: number;
}) {
  try {
    const response = await fetch(
      `http://localhost:3000/movie_info?tmdb_movie_id=${input.tmdbMovieId}&user_id=${input.userId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );

    if (response.status === 200) {
      const responseData = await response.json();
      return { data: responseData.data as MovieLinkInfo, status: 200 };
    } else {
      return { message: "The server denied our request.", status: 500 };
    }
  } catch (e) {
    return { message: "Failed fetching from the API", status: 500 };
  }
}

export async function getWatchlist(userId: number) {
  try {
    const response = await fetch(
      `http://localhost:3000/watchlist?user_id=${userId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );

    if (response.status === 200) {
      const responseData = await response.json();
      return { data: responseData.data as MovieDeepInfo[], status: 200 };
    } else {
      return { message: "The server denied our request.", status: 500 };
    }
  } catch (e) {
    return { message: "Failed fetching from the API", status: 500 };
  }
}

export async function getDiary(userId: number) {
  try {
    const response = await fetch(
      `http://localhost:3000/diary?user_id=${userId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );

    if (response.status === 200) {
      const responseData = await response.json();
      return { data: responseData.data as DiaryInfo[], status: 200 };
    } else {
      return { message: "The server denied our request.", status: 500 };
    }
  } catch (e) {
    return { message: "Failed fetching from the API", status: 500 };
  }
}

//TODO: add helper function to remove duplicated code
