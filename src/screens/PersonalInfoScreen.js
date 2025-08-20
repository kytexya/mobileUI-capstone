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
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]); // Array để chọn nhiều xe
  const [newVehicle, setNewVehicle] = useState({
    model: '',
    licensePlate: '',
    year: '',
    color: '',
    brand: ''
  });

  // Sử dụng danh sách xe từ AppConfig
  const [userVehicles, setUserVehicles] = useState(AppConfig.getVehicles());

  const onSubmit = (data) => {
    // Validate vehicle selection
    if (selectedVehicles.length === 0) {
      alert('Vui lòng chọn ít nhất một xe từ danh sách xe của bạn.');
      return;
    }

    const personalInfo = {
      fullName: data?.fullName,
      email: data?.email,
      phone: data?.phone,
    }
    
    navigation.navigate('DateTimeScreen', { 
      selectedServices, 
      personalInfo,
      vehicleOption,
      selectedVehicles: selectedVehicles,
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
          {selectedVehicles && selectedVehicles.length > 0 && (
            <View style={styles.selectedVehiclesInfo}>
              <Text style={styles.selectedVehiclesTitle}>
                Chọn xe trong kho:
              </Text>
              <View style={styles.selectedVehiclesHorizontal}>
                {selectedVehicles.map((vehicle, index) => (
                  <View key={vehicle.id} style={styles.selectedVehicleChip}>
                    <Text style={styles.selectedVehicleChipText}>
                      {vehicle.model} - {vehicle.licensePlate}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
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
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => setShowVehicleModal(true)}
            >
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
          
          {/* Chỉ hiển thị nút thêm xe khi chọn "Chọn xe mới" */}
          {vehicleOption === 'new' && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddVehicleModal(true)}
            >
              <Ionicons name="add" size={16} color="#4CAF50" />
              <Text style={styles.addButtonText}>+ Thêm một phương tiện mới</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Next button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedVehicles.length === 0 && styles.nextButtonDisabled
          ]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[
            styles.nextButtonText,
            selectedVehicles.length === 0 && styles.nextButtonTextDisabled
          ]}>
            Tiếp theo
          </Text>
        </TouchableOpacity>
        {selectedVehicles.length === 0 && (
          <Text style={styles.validationMessage}>
            Vui lòng chọn xe trước khi tiếp tục
          </Text>
        )}
      </View>

      {/* Vehicle Selection Modal */}
      <Modal
        visible={showVehicleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVehicleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
                         <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Chọn xe của bạn</Text>
               <TouchableOpacity 
                 onPress={() => setShowVehicleModal(false)}
                 style={styles.closeButton}
               >
                 <Ionicons name="close" size={24} color="#666" />
               </TouchableOpacity>
             </View>

             {/* Select All / Deselect All buttons */}
             <View style={styles.selectAllContainer}>
               <TouchableOpacity
                 style={styles.selectAllButton}
                 onPress={() => {
                   if (selectedVehicles.length === userVehicles.length) {
                     // Bỏ chọn tất cả
                     setSelectedVehicles([]);
                   } else {
                     // Chọn tất cả
                     setSelectedVehicles([...userVehicles]);
                   }
                 }}
               >
                 <Text style={styles.selectAllText}>
                   {selectedVehicles.length === userVehicles.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                 </Text>
               </TouchableOpacity>
             </View>

                         <ScrollView style={styles.vehicleList}>
               {userVehicles.map((vehicle) => (
                 <TouchableOpacity
                   key={vehicle.id}
                   style={[
                     styles.vehicleItem,
                     selectedVehicles.some(v => v.id === vehicle.id) && styles.vehicleItemSelected
                   ]}
                   onPress={() => {
                     const isSelected = selectedVehicles.some(v => v.id === vehicle.id);
                     if (isSelected) {
                       // Bỏ chọn xe
                       setSelectedVehicles(prev => prev.filter(v => v.id !== vehicle.id));
                     } else {
                       // Chọn xe
                       setSelectedVehicles(prev => [...prev, vehicle]);
                     }
                   }}
                 >
                   <View style={styles.vehicleInfo}>
                     <Text style={styles.vehicleModel}>
                       {vehicle.brand ? `${vehicle.brand} ${vehicle.model}` : vehicle.model}
                     </Text>
                                         <Text style={styles.vehicleDetails}>
                      {vehicle.licensePlate} • {vehicle.year} • {vehicle.color}
                    </Text>
                   </View>
                   <View style={[
                     styles.vehicleCheckbox,
                     selectedVehicles.some(v => v.id === vehicle.id) && styles.vehicleCheckboxSelected
                   ]}>
                     {selectedVehicles.some(v => v.id === vehicle.id) && (
                       <Ionicons name="checkmark" size={16} color="white" />
                     )}
                   </View>
                 </TouchableOpacity>
               ))}
             </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowVehicleModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
                             <TouchableOpacity
                 style={[
                   styles.confirmButton,
                   selectedVehicles.length === 0 && styles.confirmButtonDisabled
                 ]}
                 onPress={() => {
                   if (selectedVehicles.length > 0) {
                     setShowVehicleModal(false);
                     // Có thể cập nhật UI để hiển thị xe đã chọn
                     console.log('Xe đã chọn:', selectedVehicles);
                   }
                 }}
                 disabled={selectedVehicles.length === 0}
               >
                 <Text style={styles.confirmButtonText}>
                   Xác nhận ({selectedVehicles.length} xe)
                 </Text>
               </TouchableOpacity>
            </View>
          </View>
                 </View>
       </Modal>

       {/* Add New Vehicle Modal */}
       <Modal
         visible={showAddVehicleModal}
         transparent
         animationType="slide"
         onRequestClose={() => setShowAddVehicleModal(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Thêm phương tiện mới</Text>
               <TouchableOpacity 
                 onPress={() => setShowAddVehicleModal(false)}
                 style={styles.closeButton}
               >
                 <Ionicons name="close" size={24} color="#666" />
               </TouchableOpacity>
             </View>

             <ScrollView style={styles.addVehicleForm}>
               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Hãng xe *</Text>
                 <TextInput
                   style={styles.formInput}
                   placeholder="VD: Toyota, Honda, Ford..."
                   value={newVehicle.brand}
                   onChangeText={(text) => setNewVehicle(prev => ({...prev, brand: text}))}
                 />
               </View>

               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Tên xe *</Text>
                 <TextInput
                   style={styles.formInput}
                   placeholder="VD: Vios, City, Ranger..."
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
                   onChangeText={(text) => setNewVehicle(prev => ({...prev, licensePlate: text}))}
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
                 style={styles.cancelButton}
                                 onPress={() => {
                  setShowAddVehicleModal(false);
                  setNewVehicle({brand: '', model: '', licensePlate: '', year: '', color: ''});
                }}
               >
                 <Text style={styles.cancelButtonText}>Hủy</Text>
               </TouchableOpacity>
               <TouchableOpacity
                 style={[
                   styles.confirmButton,
                   (!newVehicle.brand || !newVehicle.model || !newVehicle.licensePlate || !newVehicle.year || !newVehicle.color) && styles.confirmButtonDisabled
                 ]}
                                   onPress={() => {
                    if (newVehicle.brand && newVehicle.model && newVehicle.licensePlate && newVehicle.year && newVehicle.color) {
                      // Thêm xe mới vào AppConfig
                      const vehicleToAdd = AppConfig.addVehicle(newVehicle);
                      
                      // Cập nhật state local
                      setUserVehicles(AppConfig.getVehicles());

                      // Tự động chọn xe mới vừa thêm
                      setSelectedVehicles(prev => [...prev, vehicleToAdd]);

                      // Chuyển sang chế độ "existing" để hiển thị xe đã chọn
                      setVehicleOption('existing');
                      
                      setShowAddVehicleModal(false);
                      setNewVehicle({brand: '', model: '', licensePlate: '', year: '', color: ''});
                      
                      console.log('Đã thêm xe mới vào danh sách:', vehicleToAdd);
                      console.log('Xe đã được tự động chọn:', vehicleToAdd);
                    }
                  }}
                 disabled={!newVehicle.brand || !newVehicle.model || !newVehicle.licensePlate || !newVehicle.year || !newVehicle.color}
               >
                 <Text style={styles.confirmButtonText}>Thêm xe</Text>
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
  selectedVehiclesInfo: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  selectedVehiclesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  selectedVehiclesHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedVehicleChip: {
    backgroundColor: '#e0f2f7',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1976d2',
    marginBottom: 4,
  },
  selectedVehicleChipText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
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
  vehicleInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 0,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 0,
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
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
  validationMessage: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  inputError: {
    color: "#ff0000ff",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  selectAllContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectAllButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1976d2',
  },
  selectAllText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
  vehicleList: {
    maxHeight: 300,
  },
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  vehicleItemSelected: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 3,
    borderLeftColor: '#1976d2',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#666',
  },
  vehicleCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  vehicleCheckboxSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1976d2',
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  // Add vehicle form styles
  addVehicleForm: {
    padding: 20,
    maxHeight: 400,
  },
  formField: {
    marginBottom: 20,
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
});

export default PersonalInfoScreen;
