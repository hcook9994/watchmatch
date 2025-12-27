import express from "express";
import cors from "cors";
import { createUser, loginAuthentication } from "./domain/user.js";
import { getPopularMovies, searchMovie } from "./domain/tmdb.js";
import {
  getAllMovieLinkInfo,
  movieReviewHelper,
  watchlistHelper,
} from "./domain/movie.js";

const app = express();
const port = 3000;

// Enable CORS for all origins (simple)
app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  const response = await loginAuthentication({
    username: req.body.username,
    password: req.body.password,
  });
  if (!response.status) {
    res.contentType("application/json");
    res.status(401);
    res.send(JSON.stringify({ message: "Invalid credentials" }));
    return;
  }
  res.contentType("application/json");
  res.status(200);
  res.send(
    JSON.stringify({ message: "Login successful", userId: response.userId })
  );
});

app.post("/create_user", async (req, res) => {
  await createUser({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  res.contentType("application/json");
  res.status(200);
  res.send(JSON.stringify({ message: "User creation successful" }));
});

app.get("/popular_movies", async (req, res) => {
  const popularMovieList = await getPopularMovies();
  res.contentType("application/json");
  res.status(200);
  res.send(
    JSON.stringify({
      data: popularMovieList,
      message: "Movie query successful",
    })
  );
});

app.get("/search_movies", async (req, res) => {
  // TODO: use zod here
  const searchString = req.query.search_string as string;
  if (!searchString) {
    return res.status(400).json({
      message: "searchString query parameter is required",
    });
  }

  const searchMovieList = await searchMovie(searchString);
  res.contentType("application/json");
  res.status(200);
  res.send(
    JSON.stringify({ data: searchMovieList, message: "Movie query successful" })
  );
});

app.post("/watchlist", async (req, res) => {
  await watchlistHelper({
    tmdbMovieId: req.body.tmdb_movie_id,
    toWatch: req.body.to_watch,
    userId: req.body.user_id,
  });
  res.contentType("application/json");
  res.status(200);
  res.send(JSON.stringify({ message: "Edited watchlist successfully" }));
});

app.post("/review", async (req, res) => {
  await movieReviewHelper({
    starRating: req.body.star_rating,
    tmdbMovieId: req.body.tmdb_movie_id,
    userId: req.body.user_id,
    textReview: req.body.text_review,
    watchDate: req.body.watch_date,
  });
  res.contentType("application/json");
  res.status(200);
  res.send(JSON.stringify({ message: "Added review successfully" }));
});

app.get("/movie_info", async (req, res) => {
  const tmdbMovieId = Number(req.query.tmdb_movie_id);
  const userId = Number(req.query.user_id);
  if (!tmdbMovieId || !userId) {
    return res.status(400).json({
      message: "User and Movie Id query parameter is required",
    });
  }
  const movieInfo = await getAllMovieLinkInfo({
    tmdbMovieId,
    userId,
  });
  res.contentType("application/json");
  res.status(200);
  res.send(
    JSON.stringify({ data: movieInfo, message: "Movie query successful" })
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
