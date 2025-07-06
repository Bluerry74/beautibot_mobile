import { QueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { AuthProvider } from "../components/context/AuthContext";
import "../global.css";

const queryClient = new QueryClient();
export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="detail" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="pages/cart" />
                <Stack.Screen
                    name="pages/register"
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="pages/forgot_pw" />
                <Stack.Screen name="detail/[id]" />
            </Stack>
        </AuthProvider>
    );
}
