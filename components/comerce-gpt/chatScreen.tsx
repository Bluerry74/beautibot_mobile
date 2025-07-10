import type { FaceResult } from "@/types/face";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type Message = { role: string; content: string };

interface ChatScreenProps {
  faceResult: FaceResult | null;
}

export default function ChatScreen({ faceResult }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (messages.length === 0) {
      sendMessage("");
    }
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isBotTyping]);

  async function sendMessage(userMessage: string) {
    if (userMessage.trim() === "" && messages.length > 0) return;
    if (userMessage.trim()) {
      setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    }
    setInput("");
    setIsBotTyping(true);
    try {
      const res = await fetch("/api/comerce-gpt", {
        method: "POST",
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          faceResult, 
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      let assistantBuffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        assistantBuffer += chunk; 
      }
      if (assistantBuffer.trim()) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: assistantBuffer }
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Có lỗi xảy ra, vui lòng thử lại." }
      ]);
    }
    setIsBotTyping(false);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={{ flex: 1, padding: 12 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, idx) => (
            <View key={idx} style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#ff9c86" : "#f1f1f1",
              borderRadius: 16,
              marginVertical: 4,
              padding: 10,
              maxWidth: "80%"
            }}>
              <Text style={{ color: msg.role === "user" ? "#fff" : "#000" }}>{msg.content}</Text>
            </View>
          ))}
          {isBotTyping && (
            <View style={{ alignSelf: "flex-start", marginVertical: 4 }}>
              <ActivityIndicator size="small" color="#ff9c86" />
            </View>
          )}
          {faceResult && (
            <Text selectable style={{ color: 'blue', fontSize: 12 }}>
              {JSON.stringify(faceResult, null, 2)}
            </Text>
          )}
        </ScrollView>
      </View>
      <View style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        padding: 8,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#eee"
      }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 8,
            backgroundColor: "#f9f9f9"
          }}
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
          onSubmitEditing={() => {
            if (input.trim()) sendMessage(input.trim());
          }}
          editable={!isBotTyping}
        />
        <TouchableOpacity
          onPress={() => input.trim() && sendMessage(input.trim())}
          disabled={!input.trim() || isBotTyping}
          style={{
            backgroundColor: "#ff9c86",
            borderRadius: 20,
            padding: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
