import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AppConfig from '../utils/AppConfig';
import { DOMAIN_URL } from '../utils/Constant';

const ConfirmationScreen = ({ navigation, route }) => {
  const { 
    selectedServices, 
    personalInfo, 
    vehicleOption, 
    selectedDate, 
    selectedTime, 
    selectedMechanic,
    packageId,
    selectedVehicles
  } = route.params;

  const serviceCategories = [
    {
      id: 1,
      title: 'Gói dịch vụ bảo dưỡng định kỳ',
      services: [
        { id: 1, name: 'Thay dầu động cơ', price: '150.000đ' },
        { id: 2, name: 'Thay lọc dầu', price: '50.000đ' },
        { id: 3, name: 'Thay lọc gió động cơ', price: '80.000đ' },
        { id: 4, name: 'Thay lọc gió điều hòa', price: '60.000đ' },
        { id: 5, name: 'Kiểm tra hệ thống phanh', price: '100.000đ' },
        { id: 6, name: 'Kiểm tra hệ thống điện', price: '120.000đ' },
      ]
    },
    {
      id: 2,
      title: 'Gói dịch vụ sửa chữa',
      services: [
        { id: 7, name: 'Sửa chữa động cơ', price: '500.000đ' },
        { id: 8, name: 'Sửa chữa hộp số', price: '800.000đ' },
        { id: 9, name: 'Sửa chữa hệ thống phanh', price: '300.000đ' },
        { id: 10, name: 'Sửa chữa hệ thống điện', price: '250.000đ' },
        { id: 11, name: 'Sửa chữa điều hòa', price: '400.000đ' },
        { id: 12, name: 'Sửa chữa hệ thống treo', price: '350.000đ' },
      ]
    },
    {
      id: 3,
      title: 'Gói dịch vụ vệ sinh & chăm sóc',
      services: [
        { id: 13, name: 'Rửa xe cơ bản', price: '50.000đ' },
        { id: 14, name: 'Rửa xe cao cấp', price: '100.000đ' },
        { id: 15, name: 'Đánh bóng sơn xe', price: '200.000đ' },
        { id: 16, name: 'Phủ ceramic bảo vệ', price: '800.000đ' },
        { id: 17, name: 'Vệ sinh nội thất', price: '150.000đ' },
        { id: 18, name: 'Vệ sinh động cơ', price: '120.000đ' },
      ]
    }
  ];

  // Mock data cho combo
  const comboData = [
    {
      id: 1,
      title: 'Combo Bảo Dưỡng Cơ Bản',
      description: 'Thay dầu + lọc + kiểm tra tổng thể',
      originalPrice: '560.000đ',
      discountPrice: '450.000đ',
      discount: '20%',
      services: [1, 2, 3, 4, 5, 6] // IDs của các dịch vụ trong combo
    },
    {
      id: 2,
      title: 'Combo Vệ Sinh Toàn Diện',
      description: 'Rửa xe + vệ sinh nội thất + đánh bóng',
      originalPrice: '400.000đ',
      discountPrice: '320.000đ',
      discount: '20%',
      services: [13, 17, 15] // IDs của các dịch vụ trong combo
    }
  ];

  const getSelectedServiceDetails = () => {
    // Nếu có packageId (đã chọn combo), hiển thị combo
    if (packageId) {
      const selectedCombo = comboData.find(combo => combo.id === packageId);
      if (selectedCombo) {
        return [{
          id: selectedCombo.id,
          name: selectedCombo.title,
          price: selectedCombo.discountPrice,
          isCombo: true
        }];
      }
    }
    
    // Nếu không có combo, hiển thị dịch vụ riêng lẻ
    const details = [];
    serviceCategories.forEach(category => {
      category.services.forEach(service => {
        if (selectedServices.includes(service.id)) {
          details.push(service);
        }
      });
    });
    return details;
  };

  const selectedServiceDetails = getSelectedServiceDetails();
  const vehicleCount = selectedVehicles ? selectedVehicles.length : 1;
  
  // Tính giá dựa trên combo hoặc dịch vụ riêng lẻ
  const totalPrice = selectedServiceDetails.reduce((sum, service) => {
    if (service.isCombo) {
      // Nếu là combo, lấy giá combo
      const price = parseInt(service.price.replace(/[^\d]/g, ''));
      return sum + (price * vehicleCount);
    } else {
      // Nếu là dịch vụ riêng lẻ, tính như cũ
      const price = parseInt(service.price.replace(/[^\d]/g, ''));
      return sum + (price * vehicleCount);
    }
  }, 0);

  const handleConfirmBooking = () => {
    // Here you would typically send the booking data to your backend
    // console.log('Booking confirmed:', {
    //   selectedServices,
    //   personalInfo,
    //   vehicleOption,
    //   selectedDate,
    //   selectedTime,
    //   selectedMechanic,
    //   totalPrice
    // });

    const dataSubmit = {
      vehicleId: 1,
      packageId: packageId,
      serviceIds: selectedServices,
      promotionId: null,
      appointmentDate: `2025-08-${selectedDate}T${selectedTime}:28.598Z`
    }    

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
        console.log("response ",response);
        
        navigation.navigate('BookingSuccessScreen');
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
      });
    
    // Navigate to success screen or back to home
    // navigation.navigate('BookingSuccessScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với progress bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {[1, 2, 3, 4].map((step) => (
              <View key={step} style={[styles.progressStep, step === 4 && styles.activeStep]}>
                <Text style={[styles.stepNumber, step === 4 && styles.activeStepText]}>{step}</Text>
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
            {selectedVehicles && selectedVehicles.length > 0 ? (
              <>
                {selectedVehicles.map((vehicle, index) => (
                  <View key={vehicle.id} style={styles.vehicleRow}>
                    <View style={styles.vehicleInfo}>
                      <Ionicons name="car" size={16} color="#1976d2" />
                      <View style={styles.vehicleDetails}>
                        <Text style={styles.vehicleName}>{vehicle.model}</Text>
                        <Text style={styles.vehicleSubInfo}>
                          {vehicle.licensePlate} • {vehicle.year} • {vehicle.color}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
                
              </>
            ) : (
              <View style={styles.infoRow}>
                <Ionicons name="car" size={16} color="#1976d2" />
                <Text style={styles.infoText}>
                  {vehicleOption === 'existing' ? 'Lấy từ thông tin xe của bạn' : 'Chọn xe mới'}
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
               const basePrice = parseInt(service.price.replace(/[^\d]/g, ''));
               const totalServicePrice = basePrice * vehicleCount;
               return (
                 <View key={service.id} style={styles.serviceRow}>
                   <View style={styles.serviceInfo}>
                     <Text style={styles.serviceName}>{service.name}</Text>
                     {service.isCombo && (
                       <Text style={styles.comboNote}>Gói combo tiết kiệm</Text>
                     )}
                   </View>
                   <View style={styles.priceContainer}>
                     <Text style={styles.servicePrice}>
                       {service.isCombo ? (
                         // Nếu là combo, hiển thị giá combo
                         <>
                           <Text style={styles.comboPrice}>{service.price}</Text>
                           {vehicleCount > 1 && (
                             <Text style={styles.multiplier}> x{vehicleCount}</Text>
                           )}
                         </>
                       ) : (
                         // Nếu là dịch vụ riêng lẻ, hiển thị x3 khi có nhiều xe
                         vehicleCount > 1 ? (
                           <>
                             <Text>{service.price} </Text>
                             <Text style={styles.multiplier}>x{vehicleCount}</Text>
                           </>
                         ) : (
                           service.price
                         )
                       )}
                     </Text>
                     {vehicleCount > 1 && (
                       <Text style={styles.totalServicePrice}>
                         = {totalServicePrice.toLocaleString()}đ
                       </Text>
                     )}
                   </View>
                 </View>
               );
             })}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalPrice}>{totalPrice.toLocaleString()}đ</Text>
            </View>
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian</Text>
          <View style={styles.infoCard}>
                         <View style={styles.infoRow}>
               <Ionicons name="calendar" size={16} color="#1976d2" />
               <Text style={styles.infoText}>Ngày {selectedDate} tháng 8 năm 2025</Text>
             </View>
             <View style={styles.infoRow}>
               <Ionicons name="time" size={16} color="#1976d2" />
               <Text style={styles.infoText}>{selectedTime}</Text>
             </View>
             <View style={styles.infoRow}>
               <Ionicons name="construct" size={16} color="#1976d2" />
               <Text style={styles.infoText}>
                 {selectedMechanic === 'none' ? 'Không chỉ định thợ' : 'Thợ đã chỉ định'}
               </Text>
             </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <View style={styles.termsCard}>
            <Text style={styles.termsTitle}>Điều khoản và điều kiện</Text>
            <Text style={styles.termsText}>
              • Vui lòng đến đúng giờ đã đặt lịch{'\n'}
              • Hủy lịch trước ít nhất 2 giờ{'\n'}
              • Mang theo giấy tờ xe khi đến{'\n'}
              • Thanh toán tại cửa hàng sau khi hoàn thành dịch vụ
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmBooking}
        >
          <Text style={styles.confirmButtonText}>Xác Nhận Đặt Lịch</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeStep: {
    backgroundColor: '#1976d2',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeStepText: {
    color: 'white',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  servicesCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  serviceName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  serviceInfo: {
    flex: 1,
  },
  comboNote: {
    fontSize: 11,
    color: '#ff6b35',
    fontStyle: 'italic',
    marginTop: 2,
  },
  comboPrice: {
    color: '#ff6b35',
    fontWeight: '700',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  totalServicePrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
    marginTop: 2,
  },
  multiplier: {
    color: '#666',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  vehicleRow: {
    marginBottom: 12,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vehicleDetails: {
    flex: 1,
    marginLeft: 8,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  vehicleSubInfo: {
    fontSize: 12,
    color: '#666',
  },
  vehiclePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  vehiclePriceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  vehiclePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  totalBreakdown: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  breakdownText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  termsCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmationScreen;
