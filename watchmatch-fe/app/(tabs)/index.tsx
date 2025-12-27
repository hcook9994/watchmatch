import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Pressable,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { RadioButton } from "../components/radioButtonComponent";
import { Rating } from "react-native-elements";
import { SearchBarComponent } from "../components/searchBarComponent";
import {
  getMovieLinkInfo,
  getPopularMovies,
  reviewMovie,
  searchMovies,
  watchlist,
} from "../api";
import { Movie } from "../../../watchmatch-be/connectors/tmdb";
import alert from "../../helper/alert";
import { useAuth } from "../contexts/authContext";

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
          console.log("Set info from database");
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

      {rightTabVisible && selectedMovie && (
        <View style={styles.rightTab}>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  marginRight: 80,
                  width: "50%",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, marginBottom: 20 }}>
                  {selectedMovie.title}
                </Text>
                <Text
                  style={{
                    width: "100%",
                    textAlign: "left",
                    fontSize: 14,
                    padding: 10,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Release Date: </Text>{" "}
                  {selectedMovie.release_date}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    marginBottom: 10,
                    padding: 10,
                  }}
                >
                  {selectedMovie.overview}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      marginRight: 20,
                    }}
                  >
                    <Text style={{ marginBottom: 5 }}>Watched</Text>
                    <RadioButton
                      isSelected={isWatched}
                      onPress={() => setIsWatched(!isWatched)}
                    />
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ marginBottom: 5 }}>Watch List</Text>
                    <RadioButton
                      isSelected={toWatch}
                      onPress={() => setToWatch(!toWatch)}
                    />
                  </View>
                </View>
                <Rating
                  imageSize={30}
                  showRating={true}
                  fractions={1}
                  startingValue={rating}
                  onFinishRating={setRating}
                  style={{ marginTop: 10 }}
                ></Rating>
                <TextInput
                  onChangeText={setReviewText}
                  value={reviewText}
                  style={{
                    height: 100,
                    width: "100%",
                    borderColor: "gray",
                    borderWidth: 1,
                    marginTop: 30,
                    padding: 10,
                  }}
                  multiline={true}
                  textAlignVertical={"top"}
                ></TextInput>
              </View>
              <Image
                style={styles.poster}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${selectedMovie?.poster_path}`,
                }}
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Pressable
                style={styles.button}
                onPress={() => setRightTabVisible(false)}
              >
                <Text>Close</Text>
              </Pressable>
              <Pressable
                disabled={!selectedMovie || !userId}
                style={{
                  ...styles.button,
                  marginLeft: 20,
                  backgroundColor: userId === null ? "grey" : "lightgreen",
                }}
                onPress={async () => {
                  if (!selectedMovie) return;

                  await submitReview({
                    tmdbMovieId: selectedMovie.id,
                  });
                }}
              >
                <Text>Submit</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      )}
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
  poster: {
    height: 300,
    width: 150,
    resizeMode: "contain",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "lightgreen",
    marginTop: 5,
    width: "20%",
    alignItems: "center",
  },
  rightTab: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "50%",
    height: "100%",
    backgroundColor: "white",
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    padding: 16,
    alignItems: "center",
  },
});
