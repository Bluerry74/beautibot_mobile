import { Tabs } from 'expo-router';
import { Package, PackagePlus, ShoppingBag, Star, Truck, User } from 'lucide-react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    onSurface: '#000', 
    text: '#000',      
  },
};

export default function AdminLayout() {
    return (
        <PaperProvider theme={theme}>
            <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#ff9c86" }}>
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: "Dashboard",
                        tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
                    }}
                />
                <Tabs.Screen
                    name="productmanagement"
                    options={{
                        title: "Quản lý sản phẩm",
                        tabBarIcon: ({ color, size }) => <PackagePlus color={color} size={size} />,
                    }}
                />
                <Tabs.Screen
                    name="order"
                    options={{
                        title: "Order",
                        tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />,
                    }}
                />
                <Tabs.Screen
                    name="delivery"
                    options={{
                        title: "Delivery",
                        tabBarIcon: ({ color, size }) => <Truck color={color} size={size} />,
                    }}
                />
                <Tabs.Screen
                    name="user"
                    options={{
                        title: "User",
                        tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    }}
                />
                <Tabs.Screen
                    name="review"
                    options={{
                        title: "Review",
                        tabBarIcon: ({ color, size }) => <Star color={color} size={size} />,
                    }}
                />
            </Tabs>
        </PaperProvider>
    )

}
