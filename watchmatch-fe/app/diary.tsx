import { FlatList, Text, View, StyleSheet } from "react-native";
import { useAuth } from "./contexts/authContext";
import { useEffect, useState } from "react";
import { DiaryInfo } from "../../watchmatch-be/domain/movie";
import { getDiary } from "./api";

export default function DiaryScreen() {
  // Auth context for global variables
  const { userId } = useAuth();

  // State to manage the diary list
  const [diaryList, setDiaryList] = useState<DiaryInfo[]>([]);

  // Get Diary from BE
  useEffect(() => {
    if (!userId) return;

    const queryDiary = async () => {
      const diaryApiResp = await getDiary(userId);
      if (diaryApiResp.data) {
        setDiaryList(diaryApiResp.data);
      }
    };

    queryDiary();
  }, []);
  return (
    <View>
      <FlatList
        data={diaryList} // the array of items
        keyExtractor={(item) => String(item.tmdbInfo.id)} // unique key for each item
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontSize: 18 }}>{item.tmdbInfo.title}</Text>
            <Text style={{ fontSize: 12 }}>
              {`Your rating: ${item.internal.starRating}`}
            </Text>
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
