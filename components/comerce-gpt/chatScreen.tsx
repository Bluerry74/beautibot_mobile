import color from "@/assets/Color";
import { IProduct } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ProductCard from './ProductCard';

type Message = {
  role: string;
  content?: string;
  type?: string;
  products?: any[];
  message?: string;
};

// Bỏ faceResult khỏi props
// interface ChatScreenProps {
//   faceResult: FaceResult | null;
// }

export default function ChatScreen({ faceResult, onGoToScanface }: { faceResult?: any, onGoToScanface?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const dotAnimations = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  const sendMessage = useCallback(async (userMessage: string) => {
    if (userMessage.trim() === "" && messages.length > 0) return;
    if (userMessage.trim()) {
      setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    }
    setInput("");
    setIsBotTyping(true);

    try {
      const body: any = {
        messages: [...messages, { role: "user", content: userMessage }]
      };
      // Nếu là lần đầu (messages.length === 0) và có faceResult, truyền thêm
      if (messages.length === 0 && faceResult) {
        body.face = faceResult;
      }

      const res = await fetch(process.env.EXPO_PUBLIC_GPT_URL + "/api/comerce-gpt", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        console.log("DỮ LIỆU TRẢ VỀ", data)

        if (data.type === "product-list" && Array.isArray(data.products)) {
          setMessages(prev => [
            ...prev,
            { role: "assistant", content: JSON.stringify(data) }
          ]);
        } else if (data.message) {
          setMessages(prev => [
            ...prev,
            { role: "assistant", content: data.message }
          ]);
        }
      } else {
        // Nếu là text/plain hoặc stream, lấy text và xử lý sản phẩm
        const text = await res.text();
        // Tìm dòng chứa JSON sản phẩm (dạng {type: 'product-list', ...})
        let productJson = null;
        try {
          // Tìm JSON trong text
          const match = text.match(/\{\s*"type"\s*:\s*"product-list"[\s\S]*\}/);
          if (match) {
            productJson = JSON.parse(match[0]);
          }
        } catch { }
        if (productJson && productJson.products) {
          setMessages(prev => [
            ...prev,
            { role: "assistant", content: JSON.stringify(productJson) }
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            { role: "assistant", content: text }
          ]);
        }
      }
    } catch (err) {
      console.error("[DEBUG] Fetch or parse error:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Có lỗi xảy ra, vui lòng thử lại." }
      ]);
    }
    setIsBotTyping(false);
  }, [messages, faceResult]);

  useEffect(() => {
    if (messages.length === 0) {
      sendMessage("");
    }
  }, [messages.length, sendMessage]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isBotTyping]);

  // Animation cho typing dots
  useEffect(() => {
    if (isBotTyping) {
      const animateDots = () => {
        const animations = dotAnimations.map((anim, index) => {
          return Animated.sequence([
            Animated.delay(index * 200),
            Animated.loop(
              Animated.sequence([
                Animated.timing(anim, {
                  toValue: 1,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(anim, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
                }),
              ])
            ),
          ]);
        });
        Animated.parallel(animations).start();
      };
      animateDots();
    } else {
      dotAnimations.forEach(anim => anim.setValue(0));
    }
  }, [isBotTyping, dotAnimations]);


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: color.chatBackground }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* Header cố định */}
      <View
        style={{
          height: 80,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          paddingVertical: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        {/* Nút back */}
        {onGoToScanface && (
          <TouchableOpacity
            onPress={onGoToScanface}
            style={{ position: 'absolute', left: 16, top: 24, zIndex: 10, padding: 4 }}
          >
            <Ionicons name="chevron-back" size={28} color={color.quaternary} />
          </TouchableOpacity>
        )}
        <Ionicons name="logo-octocat" size={32} color={color.quaternary} style={{ marginRight: 10, marginTop: 20 }} />
        <Text style={{ fontWeight: "bold", fontSize: 18, color: color.quaternary, letterSpacing: 1, marginTop: 25 }}>TƯ VẤN VIÊN</Text>
      </View>
      {/* Nội dung chat */}
      <View style={{ flex: 1, padding: 12, paddingTop: 0 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, idx) => {
            let parsed;
            try { parsed = JSON.parse(msg.content ?? ""); } catch { }
            if (parsed && parsed.type === "product-list" && Array.isArray(parsed.products)) {
              return (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginVertical: 4,
                  }}
                >
                  {/* Avatar assistant */}
                  <Ionicons name="logo-octocat" size={36} color={color.quaternary} style={{ marginHorizontal: 6 }} />
                  {/* Bubble */}
                  <View
                    style={{
                      backgroundColor: color.white,
                      borderRadius: 16,
                      padding: 10,
                      maxWidth: "80%",
                      alignSelf: "flex-start",
                      borderBottomRightRadius: 16,
                      borderBottomLeftRadius: 4,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                      marginBottom: 10
                    }}
                  >
                    <Text style={{ color: "#000", marginBottom: 8 }}>{parsed.message}</Text>
                    {parsed.products.map((product: IProduct) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </View>
                </View>
              );
            }
            // Bubble chat thường
            return (
              <View
                key={idx}
                style={{
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  marginVertical: 4,
                }}
              >
                {/* Avatar */}
                {msg.role === "user" ? (
                  <Ionicons name="person-circle" size={36} color={color.quaternary} style={{ marginHorizontal: 6 }} />
                ) : (
                  <Ionicons name="logo-octocat" size={36} color={color.quaternary} style={{ marginHorizontal: 6 }} />
                )}
                {/* Bubble */}
                <View
                  style={{
                    backgroundColor: msg.role === "user" ? color.white : color.white,
                    borderRadius: 16,
                    padding: 10,
                    maxWidth: "80%",
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                    borderBottomLeftRadius: msg.role === "user" ? 16 : 4,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                    marginBottom: 10
                  }}
                >
                  <Text style={{ color: msg.role === "user" ? "black" : "black" }}>
                    {(msg.content ?? '').replace(/\\n/g, '\n')}
                  </Text>
                </View>
              </View>
            );
          })}
          {isBotTyping && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                marginVertical: 4,
              }}
            >
              {/* Avatar assistant */}
              <Ionicons name="logo-octocat" size={36} color={color.quaternary} style={{ marginHorizontal: 6 }} />
              {/* Typing bubble */}
              <View
                style={{
                  backgroundColor: color.white,
                  borderRadius: 16,
                  padding: 12,
                  maxWidth: "80%",
                  alignSelf: "flex-start",
                  borderBottomRightRadius: 16,
                  borderBottomLeftRadius: 4,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", marginLeft: 4 }}>
                    {[0, 1, 2].map((index) => (
                      <Animated.View
                        key={index}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "#000",
                          marginHorizontal: 2,
                          opacity: dotAnimations[index],
                        }}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      <View style={{
        flexDirection: "row",
        padding: 15,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#eee",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
      }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 16,
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
          returnKeyType="send"
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
