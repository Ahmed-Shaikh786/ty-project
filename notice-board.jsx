import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { fetchNotices } from "../services/api";

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]); // ✅ Ensure it's an array

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = async () => {
        try {
            const data = await fetchNotices();
            if (Array.isArray(data)) {
                setNotices(data);
            } else {
                console.error("Error: Expected array but received:", data);
                setNotices([]);
            }
        } catch (error) {
            console.error("Failed to fetch notices:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notice Board</Text>
            <FlatList
                data={notices}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // ✅ Handle missing `id`
                renderItem={({ item }) => (
                    <View style={styles.notice}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text>{item.message}</Text>
                        <Text style={styles.date}>
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : "No date"}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

// ✅ Make sure `styles` is correctly defined
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    notice: { padding: 15, borderWidth: 1, borderColor: "#ccc", marginBottom: 10, borderRadius: 5, backgroundColor: "#fff" },
    title: { fontSize: 18, fontWeight: "bold", color: "#333" },
    date: { fontSize: 12, color: "#666", marginTop: 5 },
});

export default NoticeBoard;
