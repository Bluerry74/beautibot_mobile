import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "../global.css";

const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
    <Stack >
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="detail"/>
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      <Stack.Screen name="pages/cart" />
      <Stack.Screen name="pages/register" options={{headerShown: false}}/>
      <Stack.Screen name="pages/forgot_pw" />
      <Stack.Screen name="detail/[id]" />


    </Stack>
    </QueryClientProvider>
  );
}
