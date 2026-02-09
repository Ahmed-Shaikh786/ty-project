import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import NoticeBar from "../components/NoticeBar";  // ✅ Import the animated notice bar

const UserPanel = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");
    router.replace("/user-login"); // ✅ Redirect using Expo Router
  };

  return (
    <View style={styles.container}>
      <NoticeBar />  {/* ✅ Display the animated scrolling notice bar */}
      
      <View style={styles.content}>
        <Text style={styles.title}>Welcome, User</Text>

        <View style={styles.buttonContainer}>
          <Button title="📩 Submit Complaint" onPress={() => router.push("/complaint-screen")} color="#007AFF" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="🛠️ Request Service" onPress={() => router.push("/service-request")} color="#28A745" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="🚪 Logout" onPress={handleLogout} color="#FF3B30" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",  // Light grey background
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "80%",
    marginVertical: 10,
  },
});

export default UserPanel;
