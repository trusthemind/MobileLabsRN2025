import { StyleSheet, View, Image, Text } from "react-native";

type NewsItemProps = {
  title: string;
  date: string;
  text: string;
  image: any;
};

export default function NewsItem({ title, date, text, image }: NewsItemProps) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    marginHorizontal: 16,
    alignItems: "flex-start",
    gap: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: "#333",
  },
});
