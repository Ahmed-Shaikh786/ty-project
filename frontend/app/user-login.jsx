import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../services/config";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      const { token } = response.data;

      // Store the token
      await AsyncStorage.setItem("token", token);

      // Redirect to User Panel
      router.replace("/user-panel");
    } catch (error) {
      Alert.alert("Login Failed", error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22 }}>User Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderBottomWidth: 1, width: 200, marginBottom: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomWidth: 1, width: 200, marginBottom: 20 }} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
