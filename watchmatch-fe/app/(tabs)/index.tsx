import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { SearchBarComponent } from "../components/searchBarComponent";
import {
  getMovieLinkInfo,
  getPopularMovies,
  reviewMovie,
  searchMovies,
  watchlist,
} from "../api";
import alert from "../../helper/alert";
import { useAuth } from "../contexts/authContext";
import { Movie } from "../../../watchmatch-be/types/tmdb";
import { MovieReviewPanel } from "../components/rightTabMovieInfo";

// Default review text
// TODO: change this so that it isn't actually text
const defaultReviewText = "Write your review here...";

export default function MovieSearchScreen() {
  // Auth context for global variables
  const { userId } = useAuth();

  // State to manage the filtered data and search input
  const [data, setData] = useState<Movie[]>([]);
  // State to manage the search input value
  const [searchValue, setSearchValue] = useState("");
  // State to manage modal visibility
  const [rightTabVisible, setRightTabVisible] = useState(false);
  // State to manage selected movie
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>();
  // State to manage if movie is watched
  const [isWatched, setIsWatched] = useState(false);
  // State to manage if movie is to watch
  const [toWatch, setToWatch] = useState(false);
  // Number to manage movie rating
  const [rating, setRating] = useState(0);
  // State to manage the review of the movie
  const [reviewText, setReviewText] = useState(defaultReviewText);

  // TODO: handle watchlist AND reviewed conditions/overlap better
  // TODO: handle updates/deletions better, i.e. how to remove/edit a review
  async function submitReview(inputs: { tmdbMovieId: number }) {
    if (!userId) {
      setTimeout(() => {
        alert("Invalid review", "Must be logged in to review a movie", []);
      }, 100);
      return;
    }
    // If movie is watched, the assert values
    if (isWatched) {
      // Movie needs rating for models
      if (!rating) {
        setTimeout(() => {
          alert(
            "Invalid review",
            "Please provide a rating for a watched movie.",
            []
          );
        }, 100);
        return;
      }
      // Call first API - watched
      await reviewMovie({
        starRating: rating,
        textReview: reviewText, //TODO: make naming consistent here
        tmdbMovieId: inputs.tmdbMovieId,
        userId,
        // TODO: add watchDate
      });
    }

    // Call second API - watchlist
    // Always call watchlist, in case it is being removes
    await watchlist({
      tmdbMovieId: inputs.tmdbMovieId,
      toWatch: toWatch,
      userId,
    });
  }

  async function handleSelectMovie(tmdbMovieId: number) {
    if (userId) {
      const apiResponse = await getMovieLinkInfo({
        tmdbMovieId,
        userId,
      });
      if (apiResponse.status === 200) {
        const movieInfo = apiResponse.data;
        if (movieInfo && movieInfo.status !== "NOLINK") {
          setIsWatched(
            movieInfo?.status === "REVIEWED" ||
              movieInfo?.status === "WATCHLISTANDREVIEWED"
          );
          setToWatch(
            movieInfo?.status === "WATCHLIST" ||
              movieInfo?.status === "WATCHLISTANDREVIEWED"
          );
          setRating(movieInfo?.starRating ?? 0);
          setReviewText(movieInfo?.textReview ?? defaultReviewText);
          return;
        }
      }
    }
    setIsWatched(false);
    setToWatch(false);
    setRating(0);
    setReviewText(defaultReviewText);
  }

  // Query TMDB to get searched movies or popular movies
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!searchValue.trim()) {
        const defaultResults = await getPopularMovies();
        setData(defaultResults.data.data);
        return;
      }

      const results = await searchMovies(searchValue);
      setData(results.data.data);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <View
      style={{
        flex: 1,
        padding: 40,
        backgroundColor: "white",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <View style={{ flex: 1, width: "35%" }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            lineHeight: 32,
            marginBottom: 20,
          }}
        >
          Search for your movie here!
        </Text>
        <SearchBarComponent
          searchValue={searchValue} // Current search value
          setData={setData} // Function to update filtered data
          setSearchValue={setSearchValue} // Function to update search value
        />
        {/* Turn into a flatlist */}
        <ScrollView>
          {data.map((item) => (
            <TouchableHighlight
              key={item.id}
              onPress={() => {
                // Ensure right tab is visible
                setRightTabVisible(true);
                // Set selected movie
                setSelectedMovie(item);
                // Handle selected movie
                handleSelectMovie(item.id);
              }}
            >
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.title}</Text>
                <Text
                  style={{
                    ...styles.itemText,
                    marginTop: 5,
                    fontSize: 12, // Font size for the text
                  }}
                >
                  Release Date: {item.release_date}
                </Text>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
      {/* Movie Panel Only Visible When Movie is selected */}
      <MovieReviewPanel
        visible={rightTabVisible}
        movie={selectedMovie ?? null}
        isWatched={isWatched}
        setIsWatched={setIsWatched}
        toWatch={toWatch}
        setToWatch={setToWatch}
        rating={rating}
        setRating={setRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
        onClose={() => setRightTabVisible(false)}
        onSubmit={async () => {
          if (!selectedMovie) return;
          await submitReview({ tmdbMovieId: selectedMovie.id });
        }}
      />
    </View>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen
    marginTop: 30, // Margin from the top
    padding: 10, // Padding inside the container
  },
  item: {
    backgroundColor: "green", // Background color for each item
    padding: 20, // Padding inside each item
    marginVertical: 8, // Vertical margin between items
    marginHorizontal: 16, // Horizontal margin between items
    borderRadius: 8, // Rounded corners for each item
  },
  itemText: {
    color: "white", // Text color
    fontSize: 18, // Font size for the text
  },
});
