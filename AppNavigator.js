import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import UserRegister from "../../app/user-register"; // ✅ Add this
import UserLogin from "../../app/user-login";
import AdminLogin from "../../app/admin-login";
import AdminPanel from "../../app/admin-panel";
import UserPanel from "../../app/user-panel";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const role = await AsyncStorage.getItem("role");
        if (token && role) {
          setUserRole(role);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userRole === "admin" ? (
          <Stack.Screen name="AdminPanel" component={AdminPanel} />
        ) : userRole === "user" ? (
          <Stack.Screen name="UserPanel" component={UserPanel} />
        ) : (
          <>
            <Stack.Screen name="UserRegister" component={UserRegister} />  {/* ✅ Add this */}
            <Stack.Screen name="UserLogin" component={UserLogin} />
            <Stack.Screen name="AdminLogin" component={AdminLogin} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
