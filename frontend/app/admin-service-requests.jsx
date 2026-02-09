import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { fetchServiceRequestsAdmin, updateServiceRequestStatus } from "../services/api";

export default function AdminServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchServiceRequestsAdmin();
      setRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Error", "Failed to fetch service requests.");
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = async (id) => {
    const result = await updateServiceRequestStatus(id, "resolved");
    if (result?.error) {
      Alert.alert("Error", result.error);
      return;
    }
    Alert.alert("Success", "Request marked as resolved!");
    load();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
        Service Requests
      </Text>

      <Button title="Back" onPress={() => router.replace("/admin-panel")} />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : requests.length === 0 ? (
        <Text style={{ textAlign: "center", fontSize: 16, marginTop: 20 }}>
          No service requests found.
        </Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View
              style={{
                marginVertical: 10,
                padding: 15,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "#ddd",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>{item.title}</Text>
              <Text style={{ fontSize: 16, color: "#555", marginBottom: 8 }}>{item.description}</Text>
              <Text style={{ marginBottom: 8 }}>Status: {item.status}</Text>
              {item.status !== "resolved" ? (
                <Button title="Mark as Resolved" onPress={() => markAsResolved(item.id)} />
              ) : (
                <Text>✅ Resolved</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
