import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

const initialMessages = [
  { id: '1', sender: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' },
  { id: '2', sender: 'user', text: 'Tôi muốn đặt lịch bảo dưỡng.' },
  { id: '3', sender: 'bot', text: 'Bạn muốn đặt lịch vào ngày nào?' },
];

const ChatbotScreen = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { id: Date.now().toString(), sender: 'user', text: input }]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Hỗ trợ khách hàng (Chatbot)</Text>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {messages.map((item) => (
            <View key={item.id} style={[styles.message, item.sender === 'user' ? styles.userMsg : styles.botMsg]}>
              <Text style={{ color: item.sender === 'user' ? '#fff' : '#333' }}>{item.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Nhập tin nhắn..."
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  message: { padding: 10, borderRadius: 8, marginBottom: 8, maxWidth: '80%' },
  userMsg: { backgroundColor: '#007bff', alignSelf: 'flex-end' },
  botMsg: { backgroundColor: '#f1f1f1', alignSelf: 'flex-start' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginRight: 8 },
  sendBtn: { backgroundColor: '#007bff', padding: 12, borderRadius: 8 },
  sendBtnText: { color: '#fff', fontWeight: 'bold' },
});

export default ChatbotScreen; 