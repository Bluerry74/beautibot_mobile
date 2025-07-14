import { Droplets, Moon, Settings, Sun, Zap } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const routine = {
  morning: [
    { step: 1, product: "Gentle Cleanser", time: "1 min", description: "Cleanse with lukewarm water" },
    { step: 2, product: "Vitamin C Serum", time: "2 min", description: "Apply 2-3 drops, pat gently" },
    { step: 3, product: "Hyaluronic Acid", time: "1 min", description: "Apply to damp skin" },
    { step: 4, product: "Moisturizer", time: "1 min", description: "Apply evenly to face and neck" },
    { step: 5, product: "SPF 30+", time: "1 min", description: "Don't forget ears and neck" },
  ],
  evening: [
    { step: 1, product: "Oil Cleanser", time: "2 min", description: "Remove makeup and sunscreen" },
    { step: 2, product: "Water Cleanser", time: "1 min", description: "Double cleanse for deep clean" },
    { step: 3, product: "Retinol Serum", time: "2 min", description: "Start with 2x per week" },
    { step: 4, product: "Night Moisturizer", time: "1 min", description: "Rich formula for overnight repair" },
    { step: 5, product: "Face Oil", time: "1 min", description: "Optional: for extra hydration" },
  ],
  weekly: [
    { name: "Exfoliation", frequency: "2x/week", description: "BHA or AHA treatment", icon: <Zap size={20} /> },
    { name: "Face Mask", frequency: "1x/week", description: "Hydrating or purifying mask", icon: <Droplets size={20} /> },
    { name: "Deep Clean", frequency: "1x/week", description: "Clay mask or pore strips", icon: <Sun size={20} /> },
  ],
};


export default function Routine() {
  const [tab, setTab] = React.useState("morning");

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b">
        <View className="flex-row items-center gap-3">
          {/* <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
            <AvatarFallback>SK</AvatarFallback>
          </Avatar> */}
          <View>
            <Text className="text-base font-semibold">My Skincare</Text>
            <Text className="text-xs text-gray-500">Daily Routines</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Settings size={20} />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-around mt-4 mb-2">
        {[
          { key: "morning", label: "Morning", icon: <Sun size={16} /> },
          { key: "evening", label: "Evening", icon: <Moon size={16} /> },
          { key: "weekly", label: "Weekly", icon: <Zap size={16} /> },
        ].map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            className={`flex-row items-center gap-1 px-4 py-2 rounded-full ${tab === t.key ? "bg-orange-200" : "bg-white"}`}
          >
            {t.icon}
            <Text className="text-sm font-medium">{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="px-4">
        {tab !== "weekly" ? (
          routine[tab as keyof typeof routine].map((item: any) => (
            <View key={item.step} className="bg-white rounded-xl mb-3 p-4 border-l-4 border-orange-400">
              <View className="flex-row justify-between items-start">
                <View className="flex-row gap-3 items-center">
                  <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center">
                    <Text className="text-orange-600 font-bold text-center">{item.step}</Text>
                  </View>
                  <View>
                    <Text className="font-medium">{item.product}</Text>
                    <Text className="text-sm text-gray-500">{item.description}</Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-500">{item.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <>
            {routine.weekly.map((t, idx) => (
              <View key={idx} className="bg-white rounded-xl mb-3 p-4 border-l-4 border-green-400">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                    {t.icon}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between">
                      <Text className="font-medium">{t.name}</Text>
                      <Text className="text-xs text-gray-500">{t.frequency}</Text>
                    </View>
                    <Text className="text-sm text-gray-500">{t.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      </View>
  )
}