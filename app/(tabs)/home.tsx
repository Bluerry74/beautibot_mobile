import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation, useRouter } from "expo-router";
import { AlignLeft, ShoppingCart } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { routesConfig } from "../config/route";

const topService = [
    {
        name: "Manicures",
        image: require("../../assets/images/banner_login.jpg"),
    },
    { name: "Facial", image: require("../../assets/images/banner_login.jpg") },
    { name: "Haircut", image: require("../../assets/images/banner_login.jpg") },
    { name: "Waxing", image: require("../../assets/images/banner_login.jpg") },
    { name: "Haircut", image: require("../../assets/images/banner_login.jpg") },
    { name: "Haircut", image: require("../../assets/images/banner_login.jpg") },
];
const BestArtist = [
    {
        id: 1,
        name: "Alaina Tisha",
        rating: 4.8,
        price: "$39.00/hr",
        image: require("../../assets/images/banner_login.jpg"),
    },
    {
        id: 2,
        name: "Amber Heard",
        rating: 3.6,
        price: "$27.00/hr",
        image: require("../../assets/images/banner_login.jpg"),
    },
    {
        id: 3,
        name: "Nguyen Ky ",
        rating: 4.5,
        price: "$25.00/hr",
        image: require("../../assets/images/banner_login.jpg"),
    },
];
const nearArtist = [
    {
        name: "Amber Heard",
        rating: 3.6,
        price: "$27.00/hr",
        image: "https://th.bing.com/th/id/OIP.ZId6kYZXYoG2WwB_JQq7jAHaIK?r=0&rs=1&pid=ImgDetMain",
    },
    {
        name: "Nguyen Ky ",
        rating: 4.5,
        price: "$25.00/hr",
        image: "https://th.bing.com/th/id/OIP.ZId6kYZXYoG2WwB_JQq7jAHaIK?r=0&rs=1&pid=ImgDetMain",
    },
];

const Home = () => {
    const nav = useRouter();
    return (
        <ScrollView className="bg-[#FFF3EC] flex-1 px-4 pt-8 ">
            <View className="flex-row justify-between items-center mb-6 mt-8">
                <AlignLeft />
                <Text
                    className="text-xl font-semibold"
                    style={{ color: "#ff9c86" }}
                >
                    Hi There
                </Text>
                <TouchableOpacity onPress={() => nav.push(routesConfig.cart)}>
                    <ShoppingCart />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center bg-white px-4 py-2 rounded-xl mb-4">
                <Ionicons name="search" size={20} color="gray" />
                <TextInput
                    placeholder="What are you looking for?"
                    className="ml-2 flex-1 text-sm"
                />
                <TouchableOpacity className="p-2 bg-brown-700 rounded-md ml-2">
                    <MaterialIcons name="tune" size={18} color="white" />
                </TouchableOpacity>
            </View>

            <Text
                className="text-xl font-semibold mb-4"
                style={{ color: "#ff9c86" }}
            >
                Top Services
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
            >
                {topService.map((service, index) => (
                    <View key={index} className="items-center mr-6">
                        <View className="w-16 h-16 bg-white rounded-full justify-center items-center mb-2">
                            <Image
                                source={service.image}
                                className="w-16 h-16 rounded-full"
                            />
                        </View>
                        <Text className="text-xs text-center text-brown-800">
                            {service.name}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View className="flex-row justify-between items-center mb-4">
                <Text
                    className="text-xl font-semibold"
                    style={{ color: "#ff9c86" }}
                >
                    Top Artist
                </Text>
                <TouchableOpacity>
                    <Text className="text-lg text-brown-500">View all</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {BestArtist.map((artist, id) => (
                    <TouchableOpacity
                        key={id}
                        onPress={() => {
                            router.push(`/detail?id=${artist.id}`);
                        }}
                    >
                        <View className="w-52 bg-white rounded-xl mr-4 p-2">
                            <Image
                                source={artist.image}
                                className="w-full h-40 rounded-lg mb-3"
                            />
                            <Text className="font-semibold text-brown-800">
                                {artist.name}
                            </Text>
                            <Text className="text-xs text-brown-500 mb-2">
                                ABC Beauty Salon
                            </Text>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-sm">{artist.price}</Text>
                                <View className="flex-row items-center">
                                    <Ionicons
                                        name="star"
                                        size={14}
                                        color="#FFB400"
                                    />
                                    <Text className="ml-1 text-sm">
                                        {artist.rating}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View className="flex-row justify-between items-center mb-4 mt-6">
                <Text
                    className="text-xl font-semibold"
                    style={{ color: "#ff9c86" }}
                >
                    Best Artist Near You
                </Text>
                <TouchableOpacity>
                    <Text className="text-lg text-brown-500">View all</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {nearArtist.map((artist, idx) => (
                    <View
                        key={idx}
                        className="w-52 bg-white rounded-xl mr-4 p-2"
                    >
                        <Image
                            source={{ uri: artist.image }}
                            className="w-full h-40 rounded-lg mb-3"
                        />
                        <Text className="font-semibold text-brown-800">
                            {artist.name}
                        </Text>
                        <Text className="text-xs text-brown-500 mb-2">
                            Best Artist near you
                        </Text>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm">{artist.price}</Text>
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="star"
                                    size={14}
                                    color="#FFB400"
                                />
                                <Text className="ml-1 text-sm">
                                    {artist.rating}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </ScrollView>
    );
};

export default Home;
