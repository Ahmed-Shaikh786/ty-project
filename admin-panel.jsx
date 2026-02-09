import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const AdminPanel = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("role");

        // ✅ Reset navigation history so back button doesn't work
        router.replace("/admin-login");
        router.prefetch("/admin-login"); // Optional: Makes the page load faster
    };

    return (
        <View style={styles.container}>
            <Icon name="admin-panel-settings" size={80} color="#007AFF" />
            <Text style={styles.title}>Admin Dashboard</Text>

            <TouchableOpacity style={styles.button} onPress={() => router.push("/admin-complaints")}>
                <Text style={styles.buttonText}>Manage Complaints</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/admin-service-requests")}>
                <Text style={styles.buttonText}>Manage Service Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/admin-notice-board")}>
                <Text style={styles.buttonText}>Manage Notices</Text>
            </TouchableOpacity>
           

            <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
    button: { backgroundColor: "#007AFF", padding: 12, borderRadius: 5, alignItems: "center", width: "100%", marginTop: 10 },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    logout: { backgroundColor: "#FF3B30" },
});

export default AdminPanel;
