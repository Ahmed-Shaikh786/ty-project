import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import axios from "axios";

const ComplaintListScreen = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/complaints", {
      headers: { Authorization: "Bearer YOUR_JWT_TOKEN" }
    })
    .then(response => setComplaints(response.data))
    .catch(error => console.error(error));
  }, []);

  return (
    <View>
      <Text>My Complaints:</Text>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.category}</Text>
            <Text>{item.description}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ComplaintListScreen;
