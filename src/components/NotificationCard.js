import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationCard = ({ title, content, date }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.content}>{content}</Text>
    <Text style={styles.date}>{date}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#007bff',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: { fontWeight: 'bold', fontSize: 17, color: '#007bff', marginBottom: 4 },
  content: { fontSize: 15, color: '#444' },
  date: { color: '#aaa', fontSize: 13, marginTop: 6 },
});

export default NotificationCard; 