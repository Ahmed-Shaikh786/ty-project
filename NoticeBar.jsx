import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";
import { fetchNotices } from "../services/api";

const NoticeBar = () => {
  const [notices, setNotices] = useState([]);
  const scrollX = new Animated.Value(0); // Animation value

  useEffect(() => {
    loadNotices();
    startScrolling();
  }, []);

  const loadNotices = async () => {
    const data = await fetchNotices();
    setNotices(Array.isArray(data) ? data : []);
  };

  const startScrolling = () => {
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -1000, // Moves left continuously
        duration: 10000, // Speed of scrolling
        useNativeDriver: true,
      })
    ).start();
  };

  return (
    <View style={styles.noticeBarContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Animated.View style={{ transform: [{ translateX: scrollX }] }}>
          {notices.length > 0 ? (
            notices.map((notice, index) => (
              <Text key={index} style={styles.noticeText}>
                📢 {notice.title}: {notice.message} {"  |  "}
              </Text>
            ))
          ) : (
            <Text style={styles.noticeText}>No new notices available.</Text>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  noticeBarContainer: {
    backgroundColor: "#ffcc00",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#aaa",
    overflow: "hidden",
  },
  noticeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default NoticeBar;
