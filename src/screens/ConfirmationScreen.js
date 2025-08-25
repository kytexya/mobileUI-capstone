import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AppConfig from "../utils/AppConfig";
import { DOMAIN_URL } from "../utils/Constant";

const ConfirmationScreen = ({ navigation, route }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testMode, setTestMode] = useState("success"); // 'success' or 'error'
  const [allService, setAllService] = useState([]);
  const [serviceCombos, setServiceCombos] = useState([]);

  const {
    selectedServices,
    personalInfo,
    vehicleOption,
    selectedDate,
    selectedTime,
    selectedMechanic,
    packageId,
    selectedVehicle,
  } = route.params;

  const serviceCategories = [
    {
      id: 1,
      title: "Gói dịch vụ bảo dưỡng định kỳ",
      services: [
        { id: 1, name: "Thay dầu động cơ", price: "150.000đ" },
        { id: 2, name: "Thay lọc dầu", price: "50.000đ" },
        { id: 3, name: "Thay lọc gió động cơ", price: "80.000đ" },
        { id: 4, name: "Thay lọc gió điều hòa", price: "60.000đ" },
        { id: 5, name: "Kiểm tra hệ thống phanh", price: "100.000đ" },
        { id: 6, name: "Kiểm tra hệ thống điện", price: "120.000đ" },
      ],
    },
    {
      id: 2,
      title: "Gói dịch vụ sửa chữa",
      services: [
        { id: 7, name: "Sửa chữa động cơ", price: "500.000đ" },
        { id: 8, name: "Sửa chữa hộp số", price: "800.000đ" },
        { id: 9, name: "Sửa chữa hệ thống phanh", price: "300.000đ" },
        { id: 10, name: "Sửa chữa hệ thống điện", price: "250.000đ" },
        { id: 11, name: "Sửa chữa điều hòa", price: "400.000đ" },
        { id: 12, name: "Sửa chữa hệ thống treo", price: "350.000đ" },
      ],
    },
    {
      id: 3,
      title: "Gói dịch vụ vệ sinh & chăm sóc",
      services: [
        { id: 13, name: "Rửa xe cơ bản", price: "50.000đ" },
        { id: 14, name: "Rửa xe cao cấp", price: "100.000đ" },
        { id: 15, name: "Đánh bóng sơn xe", price: "200.000đ" },
        { id: 16, name: "Phủ ceramic bảo vệ", price: "800.000đ" },
        { id: 17, name: "Vệ sinh nội thất", price: "150.000đ" },
        { id: 18, name: "Vệ sinh động cơ", price: "120.000đ" },
      ],
    },
  ];

  // Mock data cho combo
  const comboData = [
    {
      id: 1,
      title: "Combo Bảo Dưỡng Cơ Bản",
      description: "Thay dầu + lọc + kiểm tra tổng thể",
      originalPrice: "560.000đ",
      discountPrice: "450.000đ",
      discount: "20%",
      services: [1, 2, 3, 4, 5, 6], // IDs của các dịch vụ trong combo
    },
    {
      id: 2,
      title: "Combo Vệ Sinh Toàn Diện",
      description: "Rửa xe + vệ sinh nội thất + đánh bóng",
      originalPrice: "400.000đ",
      discountPrice: "320.000đ",
      discount: "20%",
      services: [13, 17, 15], // IDs của các dịch vụ trong combo
    },
  ];


  const calcDiscount = (combo) => {
    if (combo?.discount > 0) {
      const priceDiscount = combo?.price * (combo?.discount / 100);
      return combo?.price - priceDiscount;
    }
    return combo?.price ?? 0;
  };

  const getSelectedServiceDetails = () => {
    // Nếu có packageId (đã chọn combo), hiển thị combo
    if (packageId) {
      const selectedCombo = serviceCombos.find((combo) => combo.packageId === packageId);
      if (selectedCombo) {
        return [
          {
            id: selectedCombo.packageId,
            packageId: selectedCombo.packageId,
            name: selectedCombo.name,
            price: calcDiscount(selectedCombo),
            isCombo: true,
          },
        ];
      }
    }

    // Nếu không có combo, hiển thị dịch vụ riêng lẻ
    const details = [];
    // serviceCategories.forEach(category => {
    //   category.services.forEach(service => {
    //     if (selectedServices.includes(service.id)) {
    //       details.push(service);
    //     }
    //   });
    // });
    allService.forEach((service) => {
      if (selectedServices.includes(service.serviceId)) {
        details.push(service);
      }
    });
    return details;
  };

  const selectedServiceDetails = getSelectedServiceDetails();
  
  const vehicleCount = selectedVehicle ? 1 : 0;

  // Tính giá dựa trên combo hoặc dịch vụ riêng lẻ
  const totalPrice = selectedServiceDetails.reduce((sum, service) => {
    const price = parseInt(service.price);
    return sum + price;
  }, 0);

  const handleConfirmBooking = () => {
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    const dataSubmit = {
      vehicleId: selectedVehicle.vehicleId,
      packageId: packageId,
      serviceIds: selectedServices,
      promotionId: null,
      appointmentDate: `${selectedDate.year}-${selectedDate.month}-${selectedDate.date}T${selectedTime}:28.598Z`,
    };

    console.log("dataSubmit ", dataSubmit);

    axios.post(DOMAIN_URL + `/Appointment/schedule?customerId=${AppConfig.USER_ID}`,
      dataSubmit,
      {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then(function (response) {
        navigation.navigate('BookingSuccessScreen');
      })
      .catch(function (error) {
      })
      .finally(function () {
        setIsLoading(false);
      });
  };

  const getAllService = () => {
    axios
      .get(`${DOMAIN_URL}/services/get-all-services?currentPage=1&pageSize=99999`, {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        if(response?.data){
          setAllService(response.data.items ?? []);
        }
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

    const getCombo = () => {
    axios
      .get(`${DOMAIN_URL}/services/get-all-service-packages?currentPage=1&pageSize=99999`, {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        if(response?.data){
          setServiceCombos(response.data.items ?? []);
        }
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
  }

  useEffect(() => {
    getAllService();
    getCombo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với progress bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {[1, 2, 3, 4].map((step) => (
              <View
                key={step}
                style={[styles.progressStep, step === 4 && styles.activeStep]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    step === 4 && styles.activeStepText,
                  ]}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Xác Nhận Đặt Lịch</Text>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={16} color="#1976d2" />
              <Text style={styles.infoText}>{personalInfo.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={16} color="#1976d2" />
              <Text style={styles.infoText}>{personalInfo.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={16} color="#1976d2" />
              <Text style={styles.infoText}>{personalInfo.phone}</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin xe</Text>
          <View style={styles.infoCard}>
            {selectedVehicle ? (
              <View style={styles.vehicleRow}>
                <View style={styles.vehicleInfo}>
                  <Ionicons name="car" size={16} color="#1976d2" />
                  <View style={styles.vehicleDetails}>
                    <Text style={styles.vehicleName}>
                      {selectedVehicle.model}
                    </Text>
                    <Text style={styles.vehicleSubInfo}>
                      {selectedVehicle.licensePlate} • {selectedVehicle.year} •{" "}
                      {selectedVehicle.make}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.infoRow}>
                <Ionicons name="car" size={16} color="#1976d2" />
                <Text style={styles.infoText}>
                  {vehicleOption === "existing"
                    ? "Chọn xe từ danh sách của bạn"
                    : "Thêm xe mới"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Selected Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dịch vụ đã chọn</Text>
          <View style={styles.servicesCard}>
            {selectedServiceDetails.map((service) => {
              return (
                <View key={service.id} style={styles.serviceRow}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    {service.isCombo && (
                      <Text style={styles.comboNote}>Gói combo tiết kiệm</Text>
                    )}
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.servicePrice}>{service.price} vnd</Text>
                  </View>
                </View>
              );
            })}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalPrice}>
                {totalPrice.toLocaleString()} vnd
              </Text>
            </View>
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={16} color="#1976d2" />
              <Text style={styles.infoText}>
                Ngày {selectedDate.date} tháng {selectedDate.month} năm{" "}
                {selectedDate.year}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={16} color="#1976d2" />
              <Text style={styles.infoText}>{selectedTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="construct" size={16} color="#1976d2" />
              <Text style={styles.infoText}>
                {selectedMechanic === "none"
                  ? "Không chỉ định thợ"
                  : "Thợ đã chỉ định"}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <View style={styles.termsCard}>
            <Text style={styles.termsTitle}>Điều khoản và điều kiện</Text>
            <Text style={styles.termsText}>
              • Vui lòng đến đúng giờ đã đặt lịch{"\n"}• Hủy lịch trước ít nhất
              2 giờ{"\n"}• Mang theo giấy tờ xe khi đến{"\n"}• Thanh toán tại
              cửa hàng sau khi hoàn thành dịch vụ{"\n"}• Mỗi lịch chỉ dành cho 1
              xe để đảm bảo chất lượng
            </Text>
          </View>
        </View>

        {/* Booking Process Info */}
        <View style={styles.section}>
          <View style={styles.processCard}>
            <Text style={styles.processTitle}>Quy trình đặt lịch</Text>
            <Text style={styles.processText}>
              • Sau khi xác nhận đặt lịch thành công, bạn có thể tạo lịch mới
              cho xe khác{"\n"}• Mỗi lịch sẽ được xử lý riêng biệt để tránh kẹt
              giờ{"\n"}• Hệ thống sẽ đảm bảo thời gian phù hợp cho từng xe
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            isLoading && styles.confirmButtonDisabled,
          ]}
          onPress={() => {handleConfirmBooking()}}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.confirmButtonText,
              isLoading && styles.confirmButtonTextDisabled,
            ]}
          >
            {isLoading ? "Đang xử lý..." : "Xác Nhận Đặt Lịch"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Final Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xác nhận đặt lịch</Text>
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.confirmIcon}>
                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              </View>

              <Text style={styles.confirmMessage}>
                Bạn có chắc chắn muốn đặt lịch này?
              </Text>

              {/* Test Mode Toggle - Only for development */}
              {/* <View style={styles.testModeContainer}>
                <Text style={styles.testModeLabel}>Test Mode:</Text>
                <View style={styles.testModeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.testModeButton,
                      testMode === "success" && styles.testModeButtonActive,
                    ]}
                    onPress={() => setTestMode("success")}
                  >
                    <Text
                      style={[
                        styles.testModeButtonText,
                        testMode === "success" &&
                          styles.testModeButtonTextActive,
                      ]}
                    >
                      Success
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.testModeButton,
                      testMode === "error" && styles.testModeButtonActive,
                    ]}
                    onPress={() => setTestMode("error")}
                  >
                    <Text
                      style={[
                        styles.testModeButtonText,
                        testMode === "error" && styles.testModeButtonTextActive,
                      ]}
                    >
                      Error
                    </Text>
                  </TouchableOpacity>
                </View>
              </View> */}

              <View style={styles.confirmDetails}>
                <View style={styles.confirmDetailRow}>
                  <Ionicons name="car" size={16} color="#1976d2" />
                  <Text style={styles.confirmDetailText}>
                    {selectedVehicle?.model} - {selectedVehicle?.licensePlate}
                  </Text>
                </View>

                <View style={styles.confirmDetailRow}>
                  <Ionicons name="calendar" size={16} color="#1976d2" />
                  <Text style={styles.confirmDetailText}>
                    Ngày {selectedDate.date} tháng {selectedDate.month} năm {selectedDate.year} lúc {selectedTime}
                  </Text>
                </View>

                <View style={styles.confirmDetailRow}>
                  <Ionicons name="card" size={16} color="#1976d2" />
                  <Text style={styles.confirmDetailText}>
                    Tổng tiền: {totalPrice.toLocaleString()} vnd
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.finalConfirmButton}
                onPress={handleFinalConfirm}
              >
                <Text style={styles.finalConfirmButtonText}>Xác nhận</Text>
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    alignItems: "center",
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeStep: {
    backgroundColor: "#1976d2",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  activeStepText: {
    color: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  servicesCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  serviceName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  serviceInfo: {
    flex: 1,
  },
  comboNote: {
    fontSize: 11,
    color: "#ff6b35",
    fontStyle: "italic",
    marginTop: 2,
  },
  comboPrice: {
    color: "#ff6b35",
    fontWeight: "700",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976d2",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  totalServicePrice: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1976d2",
    marginTop: 2,
  },
  multiplier: {
    color: "#666",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#4CAF50",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976d2",
  },
  vehicleRow: {
    marginBottom: 12,
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  vehicleDetails: {
    flex: 1,
    marginLeft: 8,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  vehicleSubInfo: {
    fontSize: 12,
    color: "#666",
  },
  vehiclePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  vehiclePriceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  vehiclePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976d2",
  },
  totalBreakdown: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  breakdownText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  termsCard: {
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: "#856404",
    lineHeight: 18,
  },
  processCard: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1976d2",
  },
  processTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 8,
  },
  processText: {
    fontSize: 12,
    color: "#1976d2",
    lineHeight: 18,
  },
  newBookingCard: {
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#4caf50",
  },
  newBookingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
  },
  newBookingText: {
    fontSize: 12,
    color: "#2e7d32",
    lineHeight: 18,
    marginBottom: 12,
  },
  newBookingButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  newBookingButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButtonDisabled: {
    backgroundColor: "#ccc",
  },
  confirmButtonTextDisabled: {
    color: "#999",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    alignItems: "center",
  },
  confirmIcon: {
    marginBottom: 16,
  },
  confirmMessage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  testModeContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1976d2",
  },
  testModeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1976d2",
    marginBottom: 8,
    textAlign: "center",
  },
  testModeButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  testModeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1976d2",
    backgroundColor: "#fff",
  },
  testModeButtonActive: {
    backgroundColor: "#1976d2",
  },
  testModeButtonText: {
    fontSize: 12,
    color: "#1976d2",
    fontWeight: "500",
  },
  testModeButtonTextActive: {
    color: "#fff",
  },
  confirmDetails: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  confirmDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  confirmDetailText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  finalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  finalConfirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ConfirmationScreen;
