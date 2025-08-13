import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';

const PersonalInfoScreen = ({ navigation, route }) => {
  const { selectedServices } = route.params;
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Nguyễn Huỳnh Vân Anh',
    email: 'nhvanh2111@gmail.com',
    phone: '0123456789',
  });
  const [vehicleOption, setVehicleOption] = useState('existing'); // 'existing' or 'new'

  const updatePersonalInfo = (field, value) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar 
        currentStep={2} 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Thông Tin Cá Nhân</Text>

        {/* Personal Information Fields */}
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Họ & tên</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={personalInfo.fullName}
                onChangeText={(text) => updatePersonalInfo('fullName', text)}
                placeholder="Nhập họ và tên"
              />
                             <TouchableOpacity style={styles.editButton}>
                 <Ionicons name="pencil" size={16} color="#1976d2" />
               </TouchableOpacity>
             </View>
           </View>

           <View style={styles.inputContainer}>
             <Text style={styles.label}>Email</Text>
             <View style={styles.inputWrapper}>
               <TextInput
                 style={styles.input}
                 value={personalInfo.email}
                 onChangeText={(text) => updatePersonalInfo('email', text)}
                 placeholder="Nhập email"
                 keyboardType="email-address"
               />
               <TouchableOpacity style={styles.editButton}>
                 <Ionicons name="pencil" size={16} color="#1976d2" />
               </TouchableOpacity>
             </View>
           </View>

           <View style={styles.inputContainer}>
             <Text style={styles.label}>Số điện thoại</Text>
             <View style={styles.inputWrapper}>
               <TextInput
                 style={styles.input}
                 value={personalInfo.phone}
                 onChangeText={(text) => updatePersonalInfo('phone', text)}
                 placeholder="Nhập số điện thoại"
                 keyboardType="phone-pad"
               />
               <TouchableOpacity style={styles.editButton}>
                 <Ionicons name="pencil" size={16} color="#1976d2" />
               </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={styles.vehicleSection}>
          <Text style={styles.sectionTitle}>Thông tin xe</Text>
          
          <View style={styles.vehicleOption}>
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => setVehicleOption('existing')}
            >
              <View style={[styles.radioButton, vehicleOption === 'existing' && styles.radioSelected]}>
                {vehicleOption === 'existing' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>Lấy từ thông tin xe của bạn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Chọn</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.vehicleOption}>
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => setVehicleOption('new')}
            >
              <View style={[styles.radioButton, vehicleOption === 'new' && styles.radioSelected]}>
                {vehicleOption === 'new' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>Chọn xe mới</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={16} color="#4CAF50" />
            <Text style={styles.addButtonText}>+ Thêm một phương tiện mới</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Next button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('DateTimeScreen', { 
            selectedServices, 
            personalInfo,
            vehicleOption 
          })}
        >
          <Text style={styles.nextButtonText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    padding: 12,
  },
  vehicleSection: {
    borderWidth: 2,
    borderColor: '#1976d2',
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#f0f8ff',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  radioSelected: {
    borderColor: '#1976d2',
    backgroundColor: '#1976d2',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1976d2',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PersonalInfoScreen;
