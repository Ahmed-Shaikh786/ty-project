// screens/ComplaintScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ComplaintScreen = ({ route }) => {
    const { complaint } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{complaint.title}</Text>
            <Text style={styles.description}>Description: {complaint.description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
    },
});

export default ComplaintScreen;
