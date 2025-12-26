import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { Movie } from "../../../watchmatch-be/connectors/tmdb";
import { getPopularMovies } from "../api";

let movieOptions: any[] = [];

export default function ReccomendationScreen() {
  // State to manage selected movie
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>();

  useEffect(() => {
    const queryPopularMovies = async () => {
      const defaultResults = await getPopularMovies();
      movieOptions = defaultResults.data.data;
      return;
    };

    queryPopularMovies();
  }, []);

  const generateMovieReccomendations = () => {
    setSelectedMovie(
      movieOptions[Math.floor(Math.random() * movieOptions.length)]
    );
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 40,
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ fontSize: 32, marginBottom: 20 }}>
          Get your Movie Reccomendation
        </Text>
        <TouchableHighlight
          onPress={generateMovieReccomendations}
          style={{
            borderRadius: 20,
            padding: 10,
            backgroundColor: "lightgreen",
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Click here
          </Text>
        </TouchableHighlight>
      </View>
      {selectedMovie && (
        <View style={{ marginTop: 30, flexDirection: "row" }}>
          <View style={{ width: "60%" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              {selectedMovie.title}
            </Text>
            <Text style={{ fontSize: 18, marginTop: 10 }}>
              {selectedMovie.overview}
            </Text>
          </View>
          <View style={{ marginLeft: 30 }}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${selectedMovie?.poster_path}`,
              }}
              style={styles.poster}
            ></Image>
          </View>
        </View>
      )}
    </View>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  poster: {
    height: 400,
    width: 200,
    resizeMode: "contain",
  },
});
