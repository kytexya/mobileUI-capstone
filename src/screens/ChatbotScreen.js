import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AppConfig from "../utils/AppConfig";
import axios from "axios";
import { DOMAIN_URL } from "../utils/Constant";

const { width } = Dimensions.get("window");

const initialMessages = [
  { id: "1", sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  { id: "2", sender: "user", text: "Tôi muốn đặt lịch bảo dưỡng." },
  { id: "3", sender: "bot", text: "Bạn muốn đặt lịch vào ngày nào?" },
];

const ChatbotScreen = ({ navigation }) => {
  // Tạo initial messages với tên người dùng
  const getUserName = () => {
    if (AppConfig.USER_OBJ && AppConfig.USER_OBJ.fullName) {
      return AppConfig.USER_OBJ.fullName;
    }
    if (AppConfig.USER_OBJ && AppConfig.USER_OBJ.name) {
      return AppConfig.USER_OBJ.name;
    }
    return "bạn";
  };

  const getInitialMessages = () => [
    {
      id: "1",
      sender: "bot",
      text: `Xin chào ${getUserName()}! Tôi là trợ lý ảo CarServ. Tôi có thể giúp bạn đặt lịch bảo dưỡng, tư vấn dịch vụ và trả lời các câu hỏi về xe. Bạn cần hỗ trợ gì không?`,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  const [messages, setMessages] = useState(getInitialMessages());
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Auto scroll to bottom when new message is added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Fade in animation for messages
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSend = () => {
    if (input.trim() === "") return;
    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    axios
      .post(`${DOMAIN_URL}/Chatbot/ask`, input.trim(), {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        console.log("response ", response.data);

        const botMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: response.data,
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, botMessage]);
      })
      .catch(function (error) {
        Alert.alert(
          "Lỗi",
          "Đã xảy ra lỗi, vui lòng thử lại!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      })
      .finally(function () {
        setIsTyping(false);
      });
  };

  const TypingIndicator = () => (
    <Animated.View
      style={[styles.message, styles.botMsg, styles.typingIndicator]}
    >
      <View style={styles.typingDots}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </View>
      <Text style={styles.typingText}>CarServ đang nhập...</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1976d2" />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <View style={styles.botAvatar}>
              <MaterialIcons name="smart-toy" size={24} color="#fff" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>CarServ Assistant</Text>
              <View style={styles.statusContainer}>
                <View style={styles.onlineIndicator} />
                <Text style={styles.statusText}>Đang hoạt động</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {messages.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[
                  styles.messageWrapper,
                  item.sender === "user"
                    ? styles.userMessageWrapper
                    : styles.botMessageWrapper,
                ]}
              >
                {item.sender === "bot" && (
                  <View style={styles.botAvatarSmall}>
                    <MaterialIcons name="smart-toy" size={16} color="#007bff" />
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "user"
                      ? styles.userBubble
                      : styles.botBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.sender === "user" ? styles.userText : styles.botText,
                    ]}
                  >
                    {item.text}
                  </Text>
                  {item.timestamp && (
                    <Text
                      style={[
                        styles.timestamp,
                        item.sender === "user"
                          ? styles.userTimestamp
                          : styles.botTimestamp,
                      ]}
                    >
                      {item.timestamp}
                    </Text>
                  )}
                </View>
              </Animated.View>
            ))}

            {isTyping && <TypingIndicator />}
          </Animated.View>
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add" size={24} color="#666" />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                input.trim() && styles.sendButtonActive,
              ]}
              onPress={handleSend}
              disabled={!input.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={input.trim() ? "#fff" : "#999"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardView: {
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#28a745",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#6c757d",
  },
  headerAction: {
    padding: 8,
  },

  // Messages Container
  messagesContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Message Wrapper
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  botMessageWrapper: {
    justifyContent: "flex-start",
  },

  // Bot Avatar
  botAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e3f2fd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 4,
  },

  // Message Bubbles
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#007bff",
    borderBottomRightRadius: 6,
    marginLeft: 50,
  },
  botBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 6,
    marginRight: 50,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  // Message Text
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  userText: {
    color: "#fff",
    fontWeight: "500",
  },
  botText: {
    color: "#212529",
  },

  // Timestamp
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  botTimestamp: {
    color: "#6c757d",
  },

  // Typing Indicator
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6c757d",
    marginHorizontal: 1,
  },
  typingText: {
    fontSize: 12,
    color: "#6c757d",
    fontStyle: "italic",
  },

  // Input Container
  inputContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#212529",
    textAlignVertical: "center",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dee2e6",
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: "#007bff",
    transform: [{ scale: 1.1 }],
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
});

export default ChatbotScreen;
