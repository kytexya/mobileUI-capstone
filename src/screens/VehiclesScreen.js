import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState([
    { id: '1', name: 'Toyota Camry', plate: '30A-12345' },
    { id: '2', name: 'Honda CRV', plate: '51B-67890' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPlate, setNewPlate] = useState('');

  const handleAddVehicle = () => {
    if (newName.trim() && newPlate.trim()) {
      setVehicles([...vehicles, { id: Date.now().toString(), name: newName, plate: newPlate }]);
      setNewName('');
      setNewPlate('');
      setModalVisible(false);
    }
  };

  const handleDelete = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleInfo}>
        <MaterialCommunityIcons name="car" size={28} color="#1976d2" style={styles.vehicleIcon} />
        <View>
          <Text style={styles.vehicleName}>{item.name}</Text>
          <Text style={styles.vehiclePlate}>{item.plate}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteBtn} 
        onPress={() => handleDelete(item.id)}
        activeOpacity={0.7}
      >
        <FontAwesome5 name="trash" size={16} color="#ff5252" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>DANH SÁCH XE</Text>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="car-sports" size={28} color="#22336b" style={{ marginRight: 8 }} />
        <Text style={styles.title}>Quản lý xe của bạn</Text>
      </View>
      <ScrollView 
        style={{ marginBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {vehicles.length > 0 ? (
          vehicles.map((item) => renderItem({ item }))
        ) : (
          <Text style={styles.emptyText}>Chưa có xe nào. Hãy thêm xe mới!</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
        <FontAwesome5 name="plus" size={16} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.addBtnText}>Thêm xe mới</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FontAwesome5 name="car" size={32} color="#007bff" style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Thêm xe mới</Text>
            <TextInput style={styles.input} placeholder="Tên xe" value={newName} onChangeText={setNewName} />
            <TextInput style={styles.input} placeholder="Biển số" value={newPlate} onChangeText={setNewPlate} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAddVehicle}>
              <Text style={styles.saveBtnText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', marginTop: 8 }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, backgroundColor: '#f4f6fb' },
  subtitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginTop: 28,
    marginLeft: 16,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22336b',
    marginBottom: 0,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    marginTop: 0,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    marginRight: 14,
    opacity: 0.8,
  },
  vehicleName: { fontSize: 15, fontWeight: '600', color: '#22336b', marginBottom: 2 },
  vehiclePlate: { fontSize: 13, color: '#1976d2', fontFamily: 'monospace', letterSpacing: 1 },
  deleteBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ff5252',
    transition: 'background-color 0.2s',
  },
  deleteBtnPressed: {
    backgroundColor: '#ffeaea',
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#22336b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
    elevation: 0,
  },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 15, letterSpacing: 0.2 },
  emptyText: { textAlign: 'center', color: '#bbb', marginTop: 32, fontSize: 15 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.10)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb', padding: 24, width: 320, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 14, color: '#22336b' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 12, width: '100%', fontSize: 15, backgroundColor: '#f8f9fb' },
  saveBtn: { backgroundColor: '#22336b', padding: 13, borderRadius: 8, alignItems: 'center', width: '100%', marginTop: 4 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});

export default VehiclesScreen; 