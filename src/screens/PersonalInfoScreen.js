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
import { useForm, Controller } from "react-hook-form";
import { emailRegex, phoneRegex } from '../utils/validator';
import AppConfig from '../utils/AppConfig';

const PersonalInfoScreen = ({ navigation, route }) => {

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues: {
    fullName: AppConfig.USER_OBJ.fullName,
    email: AppConfig.USER_OBJ.email,
    phone: AppConfig.USER_OBJ.phoneNumber,
  } });

  const { selectedServices, packageId } = route.params;
  const [vehicleOption, setVehicleOption] = useState('existing'); // 'existing' or 'new'

  const onSubmit = (data) => {
    const personalInfo = {
      fullName: data?.fullName,
      email: data?.email,
      phone: data?.phone,
    }
    
    navigation.navigate('DateTimeScreen', { 
      selectedServices, 
      personalInfo,
      vehicleOption,
      packageId
    })
  }

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
              <Controller
                control={control}
                name="fullName"
                rules={{
                  required: "Vui lòng nhập họ và tên !",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.fullName && styles.errorField,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="Nhập họ và tên"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                      <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="pencil" size={16} color="#1976d2" />
                      </TouchableOpacity>
                    </View>
                    {errors.fullName && (
                      <Text style={styles.inputError}>
                        {errors.fullName.message}
                      </Text>
                    )}
                  </View>
                )}
              />
           </View>

           <View style={styles.inputContainer}>
             <Text style={styles.label}>Email</Text>
             <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email không hợp lệ !",
                  validate: (value) =>
                    emailRegex.test(value) ||
                    "Email không hợp lệ !",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.email && styles.errorField,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="Nhập email"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="email-address"
                      />
                      <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="pencil" size={16} color="#1976d2" />
                      </TouchableOpacity>
                    </View>
                    {errors.email && (
                      <Text style={styles.inputError}>
                        {errors.email.message}
                      </Text>
                    )}
                  </View>
                )}
              />
           </View>

           <View style={styles.inputContainer}>
             <Text style={styles.label}>Số điện thoại</Text>
            <Controller
                control={control}
                name="phone"
                rules={{
                  required: "Email không hợp lệ !",
                  validate: (value) =>
                    phoneRegex.test(value) ||
                    "Số điện thoại không hợp lệ !",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.phone && styles.errorField,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="Nhập số điện thoại"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                      />
                      <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="pencil" size={16} color="#1976d2" />
                      </TouchableOpacity>
                    </View>
                    {errors.phone && (
                      <Text style={styles.inputError}>
                        {errors.phone.message}
                      </Text>
                    )}
                  </View>
                )}
              />
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
              <Text style={styles.radioLabel}>Lấy từ thông tin xe của bạn (Xpander)</Text>
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
          onPress={handleSubmit(onSubmit)}
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
  errorField: {
    borderWidth: 1,
    borderColor: '#ff0000ff',
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
  inputError: {
    color: "#ff0000ff",
  },
});

export default PersonalInfoScreen;
