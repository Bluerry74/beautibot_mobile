import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../components/context/AuthContext";
import "../global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Slot />
                <Toast />
            </AuthProvider>
        </QueryClientProvider>
    );
}
