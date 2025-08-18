import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('Nguyễn Văn A');
  const [email, setEmail] = useState('nguyenvana@email.com');
  const [phone, setPhone] = useState('0123456789');

  // Mock data xe của người dùng
  const userVehicles = [
    {
      id: 1,
      brand: 'Toyota',
      model: 'Camry',
      licensePlate: '30A-12345',
      year: '2022',
      color: 'Trắng',
    },
    {
      id: 2,
      brand: 'Honda',
      model: 'CRV',
      licensePlate: '51B-67890',
      year: '2021',
      color: 'Đen',
    }
  ];

  // Mock data thống kê
  const userStats = {
    totalServices: 12,
    completedServices: 8,
    totalSpent: 2500000,
    memberSince: '2023'
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: () => navigation.replace('LoginScreen') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatarCircle}>
          <FontAwesome5 name="user-alt" size={38} color="#1976d2" />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Thống kê người dùng */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Thống kê</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="car-cog" size={24} color="#1976d2" />
            <Text style={styles.statNumber}>{userStats.totalServices}</Text>
            <Text style={styles.statLabel}>Tổng dịch vụ</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{userStats.completedServices}</Text>
            <Text style={styles.statLabel}>Đã hoàn thành</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="currency-usd" size={24} color="#FF6B35" />
            <Text style={styles.statNumber}>{(userStats.totalSpent / 1000000).toFixed(1)}M</Text>
            <Text style={styles.statLabel}>Tổng chi tiêu</Text>
          </View>
        </View>
      </View>

      {/* Danh sách xe */}
      <View style={styles.vehiclesCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Xe của bạn ({userVehicles.length})</Text>
          <TouchableOpacity onPress={() => navigation.navigate('VehiclesScreen')}>
            <Text style={styles.seeAllText}>Quản lý</Text>
          </TouchableOpacity>
        </View>
        {userVehicles.map((vehicle, index) => (
          <View key={vehicle.id} style={[
            styles.vehicleItem, 
            index === userVehicles.length - 1 && { borderBottomWidth: 0 }
          ]}>
            <View style={styles.vehicleIcon}>
              <MaterialCommunityIcons name="car" size={20} color="#1976d2" />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle.brand} {vehicle.model}</Text>
              <Text style={styles.vehicleDetails}>{vehicle.licensePlate} • {vehicle.color} • {vehicle.year}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Form chỉnh sửa thông tin */}
      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color="#1976d2" style={styles.inputIcon} />
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Họ và tên" />
        </View>
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={20} color="#1976d2" style={styles.inputIcon} />
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
        </View>
        <View style={styles.inputRow}>
          <Ionicons name="call-outline" size={20} color="#1976d2" style={styles.inputIcon} />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Số điện thoại" keyboardType="phone-pad" />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fa', paddingTop: 38 },
  avatarWrap: { alignItems: 'center', marginBottom: 20, paddingHorizontal: 16 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  email: { fontSize: 14, color: '#666', marginBottom: 2 },
  formCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: '#222',
    backgroundColor: 'transparent',
  },
  button: { 
    backgroundColor: '#1976d2', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { 
    backgroundColor: '#ff4d4f', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  // New styles for additional sections
  statsCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  vehiclesCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen; 