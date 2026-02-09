import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../services/config";

const ComplaintScreen = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const submitComplaint = async () => {
    if (!category || !description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, description }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Complaint Submitted Successfully!");
        setCategory("");
        setDescription("");
        router.replace("/user-panel");
      } else {
        Alert.alert("Error", data.error || "Failed to submit complaint");
      }
    } catch (error) {
      console.error("Complaint Submission Error:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Complaint Category:</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Enter Category"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter Description"
        multiline
      />

      <Button title="Submit Complaint" onPress={submitComplaint} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default ComplaintScreen;
