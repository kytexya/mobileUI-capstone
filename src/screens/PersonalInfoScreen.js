import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../components/ProgressBar";
import { useForm, Controller } from "react-hook-form";
import { emailRegex, phoneRegex } from "../utils/validator";
import AppConfig from "../utils/AppConfig";
import { DOMAIN_URL } from "../utils/Constant";
import axios from "axios";

const PersonalInfoScreen = ({ navigation, route }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      "fullName": AppConfig.USER_OBJ.fullName,
      "email": AppConfig.USER_OBJ.email,
      "phone": AppConfig.USER_OBJ.phoneNumber,
    },
  });  

  const { selectedServices, packageId } = route.params;
  const [vehicleOption, setVehicleOption] = useState("existing"); // 'existing' or 'new'
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Chỉ chọn 1 xe
  const [newVehicle, setNewVehicle] = useState({
    model: "",
    licensePlate: "",
    year: "",
    color: "",
    brand: "",
  });
  const [availableVehicles,setAvailableVehicles] = useState([])
  
  // Lấy danh sách xe có thể đặt lịch và xe đã được đặt lịch
  // const availableVehicles = AppConfig.getAvailableVehicles();
  const scheduledVehicles = AppConfig.getScheduledVehicles();

  // Mock data cho danh sách xe của user
  // const [userVehicles, setUserVehicles] = useState(AppConfig.getVehicles());

  const getVehicle = () => {
    axios
      .get(`${DOMAIN_URL}/Vehicle/customer/${AppConfig.USER_ID}`, {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        setAvailableVehicles(AppConfig.getAvailableVehicles(response.data));
      })
      .catch(function (error) {
        Alert.alert(
          "Lỗi",
          "Đã xảy ra lỗi, vui lòng thử lại!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      })
      .finally(function () {});
  };

  useEffect(() => {
    getVehicle();
  }, []);

  const onSubmit = (data) => {
    // Validate vehicle selection
    if (!selectedVehicle) {
      alert("Vui lòng chọn ít nhất một xe từ danh sách xe của bạn.");
      return;
    }

    const personalInfo = {
      fullName: data?.fullName,
      email: data?.email,
      phone: data?.phone,
    };

    navigation.navigate("DateTimeScreen", {
      selectedServices,
      personalInfo,
      vehicleOption,
      selectedVehicle,
      packageId,
    });
  };

  const handleAddNewVehicle = () => {
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.licensePlate || !newVehicle.year || !newVehicle.color) {
      alert('Vui lòng điền đầy đủ thông tin xe.');
      return;
    }

    // const addedVehicle = AppConfig.addVehicle(newVehicle);

    const dataSubmit = {
      licensePlate: newVehicle.licensePlate,
      make: newVehicle.color,
      model: newVehicle.model,
      year: newVehicle.year,
      carTypeId: newVehicle.carTypeId ?? 1,
    };

    axios
      .post(
        `${DOMAIN_URL}/Vehicle/add?customerId=${AppConfig.USER_ID}`,
        dataSubmit
      )
      .then(function (response) {
        setSelectedVehicle(response.data);
        setVehicleOption("new");
        getVehicle();
        setShowAddVehicleModal(false);
        setNewVehicle({
          brand: "",
          model: "",
          licensePlate: "",
          year: "",
          color: "",
        });
      })
      .catch(function (error) {
        Alert.alert(
          "Lỗi",
          "Đã xảy ra lỗi, vui lòng thử lại!",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
      })
      .finally(function () {});
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={2} onBackPress={() => navigation.goBack()} />

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
                  emailRegex.test(value) || "Email không hợp lệ !",
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
                  phoneRegex.test(value) || "Số điện thoại không hợp lệ !",
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
          <Text style={styles.vehicleNote}>
            💡 Mỗi lịch chỉ có thể chọn 1 xe để đảm bảo chất lượng dịch vụ tốt nhất. Sau khi xác nhận đặt lịch thành công, bạn có thể tạo lịch mới cho xe khác.
          </Text>
          {selectedVehicle && (
            <View style={styles.selectedVehiclesInfo}>
              <Text style={styles.selectedVehiclesTitle}>
                Xe đã chọn:
              </Text>
              <View style={styles.selectedVehiclesHorizontal}>
                <View style={styles.selectedVehicleChip}>
                  <Text style={styles.selectedVehicleChipText}>
                    {selectedVehicle.model} - {selectedVehicle.licensePlate}
                  </Text>
                </View>
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
              <Text style={styles.radioLabel}>Chọn xe từ danh sách </Text>
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
              onPress={() => setVehicleOption("new")}
            >
              <View
                style={[
                  styles.radioButton,
                  vehicleOption === "new" && styles.radioSelected,
                ]}
              >
                {vehicleOption === "new" && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>Thêm xe mới</Text>
            </TouchableOpacity>
          </View>
          
          {/* Chỉ hiển thị nút thêm xe khi chọn "Thêm xe mới" */}
          {vehicleOption === 'new' && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddVehicleModal(true)}
            >
              <Ionicons name="add" size={16} color="#4CAF50" />
              <Text style={styles.addButtonText}>
                + Thêm một phương tiện mới
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Next button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedVehicle && styles.nextButtonDisabled
          ]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[
            styles.nextButtonText,
            !selectedVehicle && styles.nextButtonTextDisabled
          ]}>
            Tiếp theo
          </Text>
        </TouchableOpacity>
        {!selectedVehicle && (
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
            
            <View style={styles.modalNote}>
              <Text style={styles.modalNoteText}>
                💡 Chỉ chọn 1 xe cho mỗi lịch. Sau khi xác nhận đặt lịch thành công, bạn có thể tạo lịch mới cho xe khác.
              </Text>
            </View>

            {/* Available Vehicles Section */}
            {availableVehicles.length > 0 && (
              <View style={styles.vehicleSection}>
                <Text style={styles.vehicleSectionTitle}>Xe có thể đặt lịch</Text>
                <ScrollView style={styles.vehicleList}>
                  {availableVehicles.map((vehicle) => (
                    <TouchableOpacity
                      key={vehicle.vehicleId}
                      style={[
                        styles.vehicleItem,
                        selectedVehicle?.vehicleId === vehicle.vehicleId && styles.vehicleItemSelected
                      ]}
                      onPress={() => {
                        setSelectedVehicle(vehicle);
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
                        selectedVehicle?.vehicleId === vehicle.vehicleId && styles.vehicleCheckboxSelected
                      ]}>
                        {selectedVehicle?.vehicleId === vehicle.vehicleId && (
                          <Ionicons name="checkmark" size={16} color="white" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Scheduled Vehicles Section */}
            {scheduledVehicles.length > 0 && (
              <View style={styles.vehicleSection}>
                <Text style={styles.vehicleSectionTitle}>Xe đã được đặt lịch</Text>
                <ScrollView style={styles.vehicleList}>
                  {scheduledVehicles.map((vehicle) => (
                    <View
                      key={vehicle.id}
                      style={styles.vehicleItemDisabled}
                    >
                      <View style={styles.vehicleInfo}>
                        <Text style={styles.vehicleModelDisabled}>
                          {vehicle.brand ? `${vehicle.brand} ${vehicle.model}` : vehicle.model}
                        </Text>
                        <Text style={styles.vehicleDetailsDisabled}>
                          {vehicle.licensePlate} • {vehicle.year} • {vehicle.color}
                        </Text>
                        <Text style={styles.scheduledNote}>
                          ⏰ Đã được đặt lịch
                        </Text>
                      </View>
                      <View style={styles.vehicleCheckboxDisabled}>
                        <Ionicons name="time" size={16} color="#999" />
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* No Available Vehicles Message */}
            {availableVehicles.length === 0 && (
              <View style={styles.noVehiclesContainer}>
                <Ionicons name="car-outline" size={48} color="#ccc" />
                <Text style={styles.noVehiclesTitle}>Không có xe nào có thể đặt lịch</Text>
                <Text style={styles.noVehiclesText}>
                  Tất cả xe của bạn đã được đặt lịch. Vui lòng hủy lịch cũ hoặc thêm xe mới.
                </Text>
              </View>
            )}

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
                  !selectedVehicle && styles.confirmButtonDisabled
                ]}
                onPress={() => {
                  if (selectedVehicle) {
                    setShowVehicleModal(false);
                  }
                }}
                disabled={!selectedVehicle}
              >
                <Text style={styles.confirmButtonText}>
                  Xác nhận
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
                <Text style={styles.formLabel}>Màu xe *</Text>
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
                onPress={() => setShowAddVehicleModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddNewVehicle}
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
    fontSize: 16,
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
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  errorField: {
    borderColor: '#dc3545',
  },
  inputError: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  vehicleSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  vehicleNote: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    lineHeight: 18,
  },
  selectedVehiclesInfo: {
    marginBottom: 16,
  },
  selectedVehiclesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectedVehiclesHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedVehicleChip: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedVehicleChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#4CAF50',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  selectButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e8',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginTop: 8,
  },
  addButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
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
    color: '#dc3545',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
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
  modalNote: {
    padding: 16,
    backgroundColor: '#e3f2fd',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 8,
  },
  modalNoteText: {
    fontSize: 12,
    color: '#1976d2',
    lineHeight: 18,
  },
  vehicleSection: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  vehicleSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  vehicleList: {
    maxHeight: 200,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  vehicleItemSelected: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  vehicleItemDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    opacity: 0.6,
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
  vehicleModelDisabled: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#666',
  },
  vehicleDetailsDisabled: {
    fontSize: 14,
    color: '#ccc',
  },
  scheduledNote: {
    fontSize: 12,
    color: '#ff9800',
    marginTop: 4,
  },
  vehicleCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleCheckboxSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  vehicleCheckboxDisabled: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  noVehiclesContainer: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 20,
  },
  noVehiclesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  noVehiclesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
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
    backgroundColor: '#4CAF50',
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
    fontWeight: '600',
  },
  addVehicleForm: {
    paddingHorizontal: 20,
    maxHeight: 400,
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default PersonalInfoScreen;
