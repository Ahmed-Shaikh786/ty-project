import { View, Text, Button, ImageBackground, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/background.jpg")} // Make sure the path is correct
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Digital Gram Panchayat</Text>
        <Button title="User Login" onPress={() => router.push("/user-login")} />
        <View style={{ height: 10 }} />
        <Button title="User Register" onPress={() => router.push("/user-register")} />
        <View style={{ height: 10 }} />
        <Button title="Admin Login" onPress={() => router.push("/admin-login")} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Light overlay for readability
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
