import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Pressable,
} from "react-native";
import { Movie } from "./types";
import { sampleData } from "./sampleData";
import { SearchBarComponent } from "./SearchBarComponent";

export default function Index() {
  // State to manage the filtered data and search input
  const [data, setData] = useState(sampleData);
  // State to manage the search input value
  const [searchValue, setSearchValue] = useState("");
  // State to manage modal visibility
  const [rightTabVisible, setRightTabVisible] = useState(false);
  // State to manage modal visibility
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>();

  return (
    <View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 40,
        }}
      >
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
        <FlatList
          data={data} // Data to display in the list
          renderItem={({ item, separators }) => (
            <TouchableHighlight
              key={item.id}
              onPress={() => {
                setRightTabVisible(true);
                setSelectedMovie(item);
              }}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}
            >
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.title}</Text>
              </View>
            </TouchableHighlight>
          )}
          keyExtractor={(item) => item.id} // Unique key for each item
        />
      </View>
      {rightTabVisible && (
        <View style={styles.rightTab}>
          <Text>{selectedMovie ? `Title: ${selectedMovie.title}` : "N/A"}</Text>
          <Text>
            {selectedMovie ? `Director: ${selectedMovie.director}` : "N/A"}
          </Text>
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "lightgreen",
    marginTop: 10,
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
    zIndex: 100,
    elevation: 10, // Android
    padding: 16,
    alignItems: "center",
  },
});
