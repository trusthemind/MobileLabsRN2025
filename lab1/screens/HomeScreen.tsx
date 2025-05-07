import { View, Text, StyleSheet, FlatList } from "react-native";
import { news } from "../data/news";
import NewsItem from "../components/NewsItem";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>News</Text>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NewsItem
            title={item.title}
            date={item.date}
            text={item.text}
            image={item.image}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
  },
});
