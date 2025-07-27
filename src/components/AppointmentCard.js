import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppointmentCard = ({ service, date, vehicle, status }) => (
  <View style={styles.card}>
    <Text style={styles.service}>{service}</Text>
    <Text style={styles.info}>Xe: <Text style={styles.value}>{vehicle}</Text></Text>
    <Text style={styles.info}>Ngày: <Text style={styles.value}>{date}</Text></Text>
    <Text style={styles.info}>Trạng thái: <Text style={[styles.status, status === 'Hoàn thành' ? styles.done : styles.processing]}>{status}</Text></Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#007bff',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  service: { fontWeight: 'bold', fontSize: 18, color: '#007bff', marginBottom: 6 },
  info: { fontSize: 15, color: '#444', marginBottom: 2 },
  value: { color: '#222', fontWeight: '500' },
  status: { fontWeight: 'bold' },
  done: { color: '#28a745' },
  processing: { color: '#ff9800' },
});

export default AppointmentCard; 