import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchComplaints, updateComplaintStatus } from "../services/api";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const data = await fetchComplaints();
    setComplaints(data);
  };

  const handleUpdateStatus = async (id, status) => {
    const response = await updateComplaintStatus(id, status);
    if (response.message) {
      Alert.alert("Success", "Complaint status updated!");
      loadComplaints(); // Refresh list after update
    } else {
      Alert.alert("Error", response.error || "Failed to update complaint status.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.complaintContainer}>
      <Text style={styles.label}>User: {item.user_name} ({item.user_email})</Text>
      <Text style={styles.label}>Category: {item.category}</Text>
      <Text style={styles.label}>Description: {item.description}</Text>
      <Text style={styles.label}>Status: {item.status}</Text>
      <View style={styles.buttonRow}>
        {item.status !== "resolved" && (
          <>
            {item.status === "pending" && (
              <Button title="Mark In Progress" onPress={() => handleUpdateStatus(item.id, "in_progress")} />
            )}
            {item.status === "in_progress" && (
              <Button title="Mark Resolved" onPress={() => handleUpdateStatus(item.id, "resolved")} />
            )}
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin - Manage Complaints</Text>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <Button title="Back to Admin Panel" onPress={() => router.replace("/admin-panel")} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  complaintContainer: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  label: { fontSize: 16, marginBottom: 5 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
});

export default AdminComplaints;
