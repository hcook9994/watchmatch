import { useState } from "react";
import {
  Button,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { Movie } from "../types";
import { sampleData } from "../sampleData";

export default function ReccomendationScreen() {
  // State to manage selected movie
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>();
  // Importing a sample movie poster image
  const moviePoster = require(`./../Qak6WgQOSX-cJatV9PnxVQ.png`);

  const generateMovieReccomendations = () => {
    setSelectedMovie(sampleData[Math.floor(Math.random() * sampleData.length)]);
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
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {selectedMovie.title}
          </Text>
          <Text style={{ fontSize: 18, marginTop: 10 }}>
            {selectedMovie.director}
          </Text>
          <Image source={moviePoster} style={styles.poster}></Image>
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
