import { FlatList, StyleSheet, View } from "react-native";
import PhotoItem from "../components/PhotoItem";
import { photos } from "../data/photos";

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        numColumns={2}
        renderItem={({ item }) => <PhotoItem photo={item.photo} />}
        keyExtractor={(_, index) => index.toString()}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingTop: 10,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
