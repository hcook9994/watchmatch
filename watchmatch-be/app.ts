import express from "express";
import cors from "cors";
import { createUser, loginAuthentication } from "./domain/user.js";
import { getPopularMovies, searchMovie } from "./domain/tmdb.js";

const app = express();
const port = 3000;

// Enable CORS for all origins (simple)
app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  const response = await loginAuthentication(
    req.body.username,
    req.body.password
  );
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
  await createUser(req.body.username, req.body.email, req.body.password);
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

app.post("/watchlist", async (req, res) => {});

app.post("/review", async (req, res) => {});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
