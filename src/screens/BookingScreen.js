import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const BookingScreen = () => {
  const [service, setService] = useState('Bảo dưỡng');
  const [vehicle, setVehicle] = useState('Toyota Camry');
  const [date, setDate] = useState('2024-06-01');
  const [time, setTime] = useState('09:00');
  const [note, setNote] = useState('');

  // DropdownPicker state
  const [serviceOpen, setServiceOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [serviceItems, setServiceItems] = useState([
    { label: 'Bảo dưỡng', value: 'Bảo dưỡng' },
    { label: 'Sửa chữa', value: 'Sửa chữa' },
    { label: 'Kiểm tra tổng quát', value: 'Kiểm tra tổng quát' },
  ]);
  const [vehicleItems, setVehicleItems] = useState([
    { label: 'Toyota Camry', value: 'Toyota Camry' },
    { label: 'Honda CRV', value: 'Honda CRV' },
  ]);

  // Đảm bảo chỉ 1 dropdown mở cùng lúc
  const onServiceOpen = () => {
    setVehicleOpen(false);
    setServiceOpen(true);
  };
  const onVehicleOpen = () => {
    setServiceOpen(false);
    setVehicleOpen(true);
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.card}>
        <Text style={styles.label}>Chọn loại dịch vụ</Text>
        <View style={{ zIndex: 3000 }}>
          <DropDownPicker
            open={serviceOpen}
            value={service}
            items={serviceItems}
            setOpen={setServiceOpen}
            setValue={setService}
            setItems={setServiceItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
            placeholder="Chọn dịch vụ"
            zIndex={3000}
            zIndexInverse={1000}
            onOpen={onServiceOpen}
            selectedItemContainerStyle={styles.selectedItem}
            selectedItemLabelStyle={styles.selectedItemLabel}
          />
        </View>
        <Text style={styles.label}>Chọn xe</Text>
        <View style={{ zIndex: 2000 }}>
          <DropDownPicker
            open={vehicleOpen}
            value={vehicle}
            items={vehicleItems}
            setOpen={setVehicleOpen}
            setValue={setVehicle}
            setItems={setVehicleItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
            placeholder="Chọn xe"
            zIndex={2000}
            zIndexInverse={2000}
            onOpen={onVehicleOpen}
            selectedItemContainerStyle={styles.selectedItem}
            selectedItemLabelStyle={styles.selectedItemLabel}
          />
        </View>
        <Text style={styles.label}>Ngày</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor="#bbb" />
        <Text style={styles.label}>Giờ</Text>
        <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="HH:mm" placeholderTextColor="#bbb" />
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput style={styles.input} value={note} onChangeText={setNote} placeholder="Ghi chú thêm" placeholderTextColor="#bbb" />
        <TouchableOpacity style={styles.button} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Xác nhận đặt lịch</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f6fb', paddingTop: 64 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 22, textAlign: 'center', color: '#22336b' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 22,
    marginHorizontal: 4,
    shadowColor: 'transparent',
  },
  label: {
    fontWeight: '600',
    color: '#555',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  dropdown: {
    borderColor: '#22336b',
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: '#f8f9fb',
    minHeight: 44,
    marginBottom: 8,
    paddingHorizontal: 8,
    zIndex: 10,
  },
  dropdownContainer: {
    borderColor: '#22336b',
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: '#f8f9fb',
    zIndex: 10,
  },
  dropdownText: {
    color: '#22336b',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'left',
  },
  selectedItem: {
    backgroundColor: '#e6f0ff',
  },
  selectedItemLabel: {
    color: '#22336b',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
    backgroundColor: '#f8f9fb',
    fontSize: 15,
    color: '#222',
  },
  button: {
    backgroundColor: '#22336b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
    elevation: 0,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16, letterSpacing: 0.5 },
});

export default BookingScreen; 