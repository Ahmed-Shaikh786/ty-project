import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { BASE_URL } from "../services/config";

const UserRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Registration successful!");
        router.replace("/user-login"); // ✅ Redirect to login page
      } else {
        Alert.alert("Registration Failed", data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22 }}>User Registration</Text>
      <TextInput placeholder="Name" onChangeText={setName} value={name} />
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} keyboardType="email-address" />
      <TextInput placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Already have an account? Login" onPress={() => router.push("/user-login")} />
    </View>
  );
};

export default UserRegister;
