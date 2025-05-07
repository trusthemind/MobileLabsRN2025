import { Image, StyleSheet, View } from "react-native";

type PhotoItemProps = {
  photo: string;
};

export default function PhotoItem({ photo }: PhotoItemProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photo }}
        style={styles.image}
        height={150}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: "100%",
  },
});
