import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VehiclesScreen = ({ navigation }) => {
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      model: 'Toyota Camry',
      licensePlate: '30A-12345',
      year: '2022',
      color: 'Trắng',
    },
    {
      id: 2,
      model: 'Honda CRV',
      licensePlate: '51B-67890',
      year: '2021',
      color: 'Đen',
    }
  ]);
  const [newVehicle, setNewVehicle] = useState({
    model: '',
    licensePlate: '',
    year: '',
    color: ''
  });

  const deleteVehicle = (vehicleId) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa xe này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
          },
        },
      ]
    );
  };

  const addVehicle = () => {
    if (newVehicle.model && newVehicle.licensePlate && newVehicle.year && newVehicle.color) {
      const vehicleToAdd = {
        id: Date.now(),
        ...newVehicle
      };
      setVehicles(prev => [...prev, vehicleToAdd]);
      setShowAddVehicleModal(false);
      setNewVehicle({model: '', licensePlate: '', year: '', color: ''});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>DANH SÁCH XE</Text>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="car" size={24} color="#1976d2" />
          <Text style={styles.headerTitle}>Quản lý xe của bạn</Text>
        </View>
      </View>

      {/* Vehicle List */}
      <ScrollView style={styles.content}>
        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleInfo}>
              <Ionicons name="car" size={24} color="#1976d2" />
              <View style={styles.vehicleText}>
                <Text style={styles.vehicleModel}>{vehicle.model}</Text>
                <Text style={styles.vehicleLicense}>{vehicle.licensePlate}</Text>
                <Text style={styles.vehicleDetails}>
                  {vehicle.year && vehicle.color ? `${vehicle.year} • ${vehicle.color}` : ''}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteVehicle(vehicle.id)}
            >
              <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add Vehicle Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddVehicleModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Thêm xe mới</Text>
        </TouchableOpacity>
      </View>

      {/* Add Vehicle Modal */}
      <Modal
        visible={showAddVehicleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddVehicleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="car" size={32} color="#1976d2" />
              <Text style={styles.modalTitle}>Thêm xe mới</Text>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Tên xe *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="VD: Toyota Vios, Honda City..."
                  value={newVehicle.model}
                  onChangeText={(text) => setNewVehicle(prev => ({...prev, model: text}))}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Biển số xe *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="VD: 30A-12345"
                  value={newVehicle.licensePlate}
                  onChangeText={(text) => setNewVehicle(prev => ({...prev, licensePlate: text.toUpperCase()}))}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Năm sản xuất *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="VD: 2022"
                  value={newVehicle.year}
                  onChangeText={(text) => setNewVehicle(prev => ({...prev, year: text}))}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Màu sắc *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="VD: Trắng, Đen, Xanh..."
                  value={newVehicle.color}
                  onChangeText={(text) => setNewVehicle(prev => ({...prev, color: text}))}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!newVehicle.model || !newVehicle.licensePlate || !newVehicle.year || !newVehicle.color) && styles.saveButtonDisabled
                ]}
                onPress={addVehicle}
                disabled={!newVehicle.model || !newVehicle.licensePlate || !newVehicle.year || !newVehicle.color}
              >
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddVehicleModal(false);
                  setNewVehicle({model: '', licensePlate: '', year: '', color: ''});
                }}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicleText: {
    marginLeft: 12,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  vehicleLicense: {
    fontSize: 14,
    color: '#666',
  },
  vehicleDetails: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '85%',
    padding: 24,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  modalForm: {
    width: '100%',
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  modalFooter: {
    width: '100%',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default VehiclesScreen; 