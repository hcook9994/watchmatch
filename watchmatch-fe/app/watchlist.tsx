import { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { MovieDeepInfo } from "../../watchmatch-be/types/tmdb";
import { getWatchlist } from "./api";
import { useAuth } from "./contexts/authContext";

export default function WatchlistScreen() {
  // Auth context for global variables
  const { userId } = useAuth();

  // State to manage the watchlist
  const [watchlist, setWatchlist] = useState<MovieDeepInfo[]>([]);

  // Get watchlist from BE
  useEffect(() => {
    if (!userId) return;

    const queryWatchlist = async () => {
      const watchlistApiResp = await getWatchlist(userId);
      if (watchlistApiResp.data) {
        setWatchlist(watchlistApiResp.data);
      }
    };

    queryWatchlist();
  }, []);

  return (
    <View>
      <FlatList
        data={watchlist} // the array of items
        keyExtractor={(item) => String(item.id)} // unique key for each item
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }} // padding around the list
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // spacing between items
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "lightgreen",
    padding: 15,
    borderRadius: 8,
  },
});
