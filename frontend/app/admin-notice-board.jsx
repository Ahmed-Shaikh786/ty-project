import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import { postNotice, fetchNotices, deleteNotice } from "../services/api";  

const AdminNoticeBoard = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    loadNotices();
  }, []);

  // ✅ Fetch notices from the server
  const loadNotices = async () => {
    console.log("📢 Fetching Notices...");
    const data = await fetchNotices();
    
    if (data.error) {
      Alert.alert("Error", "Failed to load notices.");
    } else {
      console.log("✅ Notices Fetched:", data);
      setNotices(Array.isArray(data) ? data : []);
    }
  };

  // ✅ Post a new notice
  const handlePostNotice = async () => {
    if (!title || !message) {
      Alert.alert("Error", "Title and message cannot be empty.");
      return;
    }

    const result = await postNotice(title, message);
    if (result.error) {
      Alert.alert("Error", result.error);
    } else {
      Alert.alert("Success", "Notice posted successfully!");
      setTitle("");  
      setMessage("");
      loadNotices();  // ✅ Refresh the list after posting
    }
  };

  // ✅ Delete a notice
  const handleDelete = async (id) => {
    Alert.alert("Confirm", "Are you sure you want to delete this notice?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: async () => {
          const result = await deleteNotice(id);
          if (result.error) {
            Alert.alert("Error", result.error);
          } else {
            Alert.alert("Success", "Notice deleted successfully!");
            loadNotices();  // ✅ Refresh the list after deletion
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📢 Manage Notices</Text>

      {/* ✅ Notice Input Fields */}
      <TextInput 
        style={styles.input} 
        placeholder="Title" 
        value={title} 
        onChangeText={setTitle} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Message" 
        value={message} 
        onChangeText={setMessage} 
        multiline 
      />
      <Button title="Post Notice" onPress={handlePostNotice} />

      {/* ✅ Notices List */}
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.notice}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.message}</Text>
            <Button title="Delete" color="red" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  notice: { padding: 15, borderWidth: 1, borderColor: "#ccc", marginBottom: 10, borderRadius: 5, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold" },
});

export default AdminNoticeBoard;
