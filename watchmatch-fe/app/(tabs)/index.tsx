import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { Movie } from "../types";
import { sampleData } from "../sampleData";
import { RadioButton } from "../radioButtonComponent";
import { Rating } from "react-native-elements";
import { SearchBarComponent } from "../searchBarComponent";

export default function MovieSearchScreen() {
  // State to manage the filtered data and search input
  const [data, setData] = useState(sampleData);
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
  // Importing a sample movie poster image
  const moviePoster = require(`./../Qak6WgQOSX-cJatV9PnxVQ.png`);

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
                setRightTabVisible(true);
                setSelectedMovie(item);
                setIsWatched(false);
                setToWatch(false);
                setRating(0);
              }}
            >
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.title}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>

      {rightTabVisible && (
        <View style={styles.rightTab}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ marginRight: 80 }}>
              <Text style={{ fontSize: 20, marginBottom: 20 }}>
                {selectedMovie ? `${selectedMovie.title}` : "N/A"}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 10 }}>
                {selectedMovie ? `Director: ${selectedMovie.director}` : "N/A"}
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
            </View>
            <Image source={moviePoster} style={styles.poster}></Image>
          </View>
          <Pressable
            style={[styles.button]}
            onPress={() => setRightTabVisible(false)}
          >
            <Text>Close</Text>
          </Pressable>
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
    height: 400,
    width: 200,
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
