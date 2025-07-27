import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ServiceCard = ({ title, description, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.desc}>{description}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#007bff',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 6,
  },
  desc: {
    fontSize: 15,
    color: '#444',
  },
});

export default ServiceCard; 