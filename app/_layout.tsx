import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "./component/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack >
        <Stack.Screen name="index" options={{headerShown: false}}/>
        <Stack.Screen name="detail"/>
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen name="pages/cart" />
        <Stack.Screen name="pages/register" options={{headerShown: false}}/>
        <Stack.Screen name="pages/forgot_pw" />
      </Stack>
    </AuthProvider>
  );
}
