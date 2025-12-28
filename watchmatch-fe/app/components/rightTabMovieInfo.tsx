import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";
import { Rating } from "react-native-ratings";
import { RadioButton } from "./radioButtonComponent";
import { Movie } from "../../../watchmatch-be/types/tmdb";
import { useAuth } from "../contexts/authContext";

type Props = {
  visible: boolean;
  movie: Movie | null;
  isWatched: boolean;
  setIsWatched: (v: boolean) => void;
  toWatch: boolean;
  setToWatch: (v: boolean) => void;
  rating: number;
  setRating: (v: number) => void;
  reviewText: string;
  setReviewText: (v: string) => void;
  onClose: () => void;
  onSubmit: () => Promise<void>;
};

export function MovieReviewPanel({
  visible,
  movie,
  isWatched,
  setIsWatched,
  toWatch,
  setToWatch,
  rating,
  setRating,
  reviewText,
  setReviewText,
  onClose,
  onSubmit,
}: Props) {
  // Auth context for global variables
  const { userId } = useAuth();

  if (!visible || !movie) return null;

  return (
    <View style={styles.rightTab}>
      <ScrollView>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <View
            style={{
              marginRight: 80,
              width: "50%",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Text style={{ padding: 10, fontSize: 20, marginBottom: 10 }}>
              {movie.title}
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
              {movie.release_date}
            </Text>

            <Text style={{ padding: 10 }}>{movie.overview}</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View style={{ marginRight: 20, alignItems: "center" }}>
                <Text style={{ marginBottom: 5 }}>Watched</Text>
                <RadioButton
                  isSelected={isWatched}
                  onPress={() => setIsWatched(!isWatched)}
                />
              </View>

              <View style={{ alignItems: "center" }}>
                <Text style={{ marginBottom: 5 }}>Watch List</Text>
                <RadioButton
                  isSelected={toWatch}
                  onPress={() => setToWatch(!toWatch)}
                />
              </View>
            </View>

            <Rating
              imageSize={30}
              startingValue={rating}
              onFinishRating={setRating}
              style={{ marginTop: 10 }}
              fractions={1}
              showRating={true}
            />

            <TextInput
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              textAlignVertical="top"
              style={{
                height: 100,
                width: "100%",
                borderColor: "gray",
                borderWidth: 1,
                marginTop: 30,
                padding: 10,
              }}
            />
          </View>

          <Image
            style={styles.poster}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
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
          <Pressable style={styles.button} onPress={onClose}>
            <Text>Close</Text>
          </Pressable>

          <Pressable
            disabled={!userId}
            style={{
              ...styles.button,
              marginLeft: 20,
              backgroundColor: userId ? "lightgreen" : "grey",
            }}
            onPress={onSubmit}
          >
            <Text>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "40%",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    height: 100,
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
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
  poster: {
    marginTop: 50,
    height: 300,
    width: 150,
    resizeMode: "contain",
  },
});
