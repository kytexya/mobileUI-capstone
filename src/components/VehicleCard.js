import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const VehicleCard = ({ name, plate, onDelete }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.plate}>{plate}</Text>
    <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
      <Text style={styles.deleteText}>Xóa</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    elevation: 3,
    shadowColor: '#007bff',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#007bff' },
  plate: { fontSize: 15, color: '#555', marginBottom: 8 },
  deleteBtn: { position: 'absolute', right: 18, top: 18, backgroundColor: '#ff4d4f', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  deleteText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default VehicleCard; 