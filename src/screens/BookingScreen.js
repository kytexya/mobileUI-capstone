import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BookingScreen = ({ navigation }) => {
  const [service, setService] = useState('Bảo dưỡng');
  const [vehicle, setVehicle] = useState('Toyota Camry');
  const [date, setDate] = useState('2024-06-01');
  const [time, setTime] = useState('09:00');
  const [note, setNote] = useState('');

  // Modal state
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [serviceItems] = useState([
    { label: 'Bảo dưỡng', value: 'Bảo dưỡng' },
    { label: 'Sửa chữa', value: 'Sửa chữa' },
    { label: 'Kiểm tra tổng quát', value: 'Kiểm tra tổng quát' },
  ]);
  const [vehicleItems] = useState([
    { label: 'Toyota Camry', value: 'Toyota Camry' },
    { label: 'Honda CRV', value: 'Honda CRV' },
  ]);

  const selectService = (selectedService) => {
    setService(selectedService);
    setServiceModalVisible(false);
  };

  const selectVehicle = (selectedVehicle) => {
    setVehicle(selectedVehicle);
    setVehicleModalVisible(false);
  };

  const viewServicePackages = () => {
    navigation.navigate('ServicePackageScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch dịch vụ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Service Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="car-cog" size={24} color="#007bff" />
            <Text style={styles.sectionTitle}>Thông tin dịch vụ</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loại dịch vụ</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setServiceModalVisible(true)}
            >
              <Text style={styles.dropdownText}>{service}</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#007bff" />
            </TouchableOpacity>
          </View>

          {/* Service Packages Button */}
          <TouchableOpacity 
            style={styles.packageButton}
            onPress={viewServicePackages}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#34d399', '#10b981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <MaterialCommunityIcons name="package-variant" size={20} color="#fff" />
              <Text style={styles.packageButtonText}>Xem gói dịch vụ</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Vehicle Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="car" size={24} color="#007bff" />
            <Text style={styles.sectionTitle}>Thông tin xe</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chọn xe</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setVehicleModalVisible(true)}
            >
              <Text style={styles.dropdownText}>{vehicle}</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Schedule Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color="#007bff" />
            <Text style={styles.sectionTitle}>Lịch hẹn</Text>
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Ngày</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="calendar" size={20} color="#007bff" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={date} 
                  onChangeText={setDate} 
                  placeholder="YYYY-MM-DD" 
                  placeholderTextColor="#bbb" 
                />
              </View>
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Giờ</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#007bff" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={time} 
                  onChangeText={setTime} 
                  placeholder="HH:mm" 
                  placeholderTextColor="#bbb" 
                />
              </View>
            </View>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="note-text" size={24} color="#007bff" />
            <Text style={styles.sectionTitle}>Ghi chú</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thông tin bổ sung</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="pencil" size={20} color="#007bff" style={styles.inputIcon} />
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={note} 
                onChangeText={setNote} 
                placeholder="Ghi chú thêm về dịch vụ..." 
                placeholderTextColor="#bbb"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} activeOpacity={0.85}>
          <LinearGradient
            colors={['#007bff', '#0056b3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientConfirmButton}
          >
            <MaterialCommunityIcons name="check-circle" size={24} color="#fff" />
            <Text style={styles.confirmButtonText}>Xác nhận đặt lịch</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Service Modal */}
      <Modal
        visible={serviceModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setServiceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn loại dịch vụ</Text>
            {serviceItems.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.modalItem,
                  service === item.value && styles.modalItemSelected
                ]}
                onPress={() => selectService(item.value)}
              >
                <Text style={[
                  styles.modalItemText,
                  service === item.value && styles.modalItemTextSelected
                ]}>
                  {item.label}
                </Text>
                {service === item.value && (
                  <MaterialCommunityIcons name="check" size={20} color="#007bff" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setServiceModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Vehicle Modal */}
      <Modal
        visible={vehicleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVehicleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn xe</Text>
            {vehicleItems.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.modalItem,
                  vehicle === item.value && styles.modalItemSelected
                ]}
                onPress={() => selectVehicle(item.value)}
              >
                <Text style={[
                  styles.modalItemText,
                  vehicle === item.value && styles.modalItemTextSelected
                ]}>
                  {item.label}
                </Text>
                {vehicle === item.value && (
                  <MaterialCommunityIcons name="check" size={20} color="#007bff" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setVehicleModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f4f6fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#007bff',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    color: '#555',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 2,
  },
  dropdown: {
    borderColor: '#007bff',
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: '#f8f9fb',
    minHeight: 48,
    paddingHorizontal: 12,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
  },
  selectedItem: {
    backgroundColor: '#e6f0ff',
  },
  selectedItemLabel: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  packageButton: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#34d399',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  packageButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    paddingLeft: 44,
    backgroundColor: '#f8f9fb',
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  confirmButton: {
    marginTop: 8,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#007bff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  gradientConfirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  confirmButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemSelected: {
    backgroundColor: '#e6f0ff',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalItemTextSelected: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  modalCancelButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  modalCancelText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen; 