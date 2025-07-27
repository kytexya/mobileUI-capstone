import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('Nguyễn Văn A');
  const [email, setEmail] = useState('nguyenvana@email.com');
  const [phone, setPhone] = useState('0123456789');

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
    <View style={styles.container}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatarCircle}>
          <FontAwesome5 name="user-alt" size={38} color="#1976d2" />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <View style={styles.formCard}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fb', alignItems: 'center', paddingTop: 32 },
  avatarWrap: { alignItems: 'center', marginBottom: 18 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#e3f2fd', alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 3, borderColor: '#fff', elevation: 2, shadowColor: '#1976d2', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }
  },
  name: { fontSize: 20, fontWeight: 'bold', color: '#22336b', marginBottom: 2 },
  email: { fontSize: 14, color: '#888', marginBottom: 2 },
  formCard: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: '#222',
    backgroundColor: 'transparent',
  },
  button: { backgroundColor: '#1976d2', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8, elevation: 1 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
  logoutBtn: { backgroundColor: '#ff4d4f', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 18, elevation: 0 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
});

export default ProfileScreen; 