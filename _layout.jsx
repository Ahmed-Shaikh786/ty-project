import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="user-login" options={{ title: "User Login" }} />
      <Stack.Screen name="admin-login" options={{ title: "Admin Login" }} />
      <Stack.Screen name="user-panel" options={{ title: "User Panel" }} />
      <Stack.Screen name="admin-panel" options={{ title: "Admin Panel" }} />
      <Stack.Screen name="user-register" options={{ title: "Register User" }} />
      <Stack.Screen name="admin-notice-board" options={{ title: "Manage Notices" }} />
      <Stack.Screen name="admin-service-requests" options={{ title: "Manage Service Requests" }} />
      
    </Stack>
  );
}
