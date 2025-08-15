import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';

const BookingFlowScreen = ({ navigation }) => {
  const [expandedService, setExpandedService] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedComboId, setSelectedComboId] = useState(null);

  const serviceCombos = [
    {
      id: '1',
      title: 'Combo Bảo Dưỡng Cơ Bản',
      description: 'Thay dầu + lọc + kiểm tra tổng thể',
      originalPrice: '560.000đ',
      discountPrice: '450.000đ',
      discount: '20%',
      services: [1, 2, 3, 5, 6],
      popular: true
    },
    {
      id: '2',
      title: 'Combo Bảo Dưỡng Toàn Diện',
      description: 'Bảo dưỡng + vệ sinh + chăm sóc',
      originalPrice: '1.200.000đ',
      discountPrice: '950.000đ',
      discount: '25%',
      services: [1, 2, 3, 4, 5, 6, 13, 17],
      popular: false
    },
    {
      id: '3',
      title: 'Combo Vệ Sinh Cao Cấp',
      description: 'Rửa xe + đánh bóng + phủ ceramic',
      originalPrice: '1.100.000đ',
      discountPrice: '850.000đ',
      discount: '23%',
      services: [14, 15, 16, 17],
      popular: false
    }
  ];

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

  const toggleService = (serviceId) => {
    setSelectedServices(prev => {
      const newServices = prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      
      // Kiểm tra xem có còn đủ dịch vụ để tạo thành combo không
      if (selectedComboId) {
        const selectedCombo = serviceCombos.find(combo => combo.id === selectedComboId);
        if (selectedCombo) {
          const comboServices = selectedCombo.services;
          const hasAllComboServices = comboServices.every(service => newServices.includes(service));
          
          // Nếu không còn đủ dịch vụ combo, chuyển sang chế độ dịch vụ riêng lẻ
          if (!hasAllComboServices) {
            setSelectedComboId(null);
          }
        }
      }
      
      return newServices;
    });
  };

  const toggleCategory = (categoryId) => {
    setExpandedService(expandedService === categoryId ? null : categoryId);
  };

  const isServiceSelected = (serviceId) => selectedServices.includes(serviceId);

  const selectCombo = (combo) => {
    // Nếu combo này đã được chọn, bỏ chọn nó
    if (selectedComboId === combo.id) {
      setSelectedComboId(null);
      setSelectedServices([]);
    } else {
      // Nếu chọn combo khác, thay thế bằng combo mới
      setSelectedComboId(combo.id);
      setSelectedServices(combo.services);
    }
  };

  const isComboSelected = (combo) => {
    return selectedComboId === combo.id;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar 
        currentStep={1} 
        onBackPress={() => navigation.goBack()} 
      />

      {/* Warning message */}
      <View style={styles.warningContainer}>
        <Text style={styles.warningText}>
          ⚠️ Vui lòng đặt lịch trước ít nhất 4 giờ
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Combo Dịch Vụ</Text>
        
        {/* Combo Services */}
        <View style={styles.comboSection}>
          {serviceCombos.map((combo) => (
            <TouchableOpacity
              key={combo.id}
              style={[styles.comboCard, isComboSelected(combo) && styles.comboCardSelected]}
              onPress={() => selectCombo(combo)}
            >
              <View style={styles.comboHeader}>
                <View style={styles.comboInfo}>
                  <Text style={styles.comboTitle}>{combo.title}</Text>
                  <Text style={styles.comboDescription}>{combo.description}</Text>
                </View>
                {combo.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Phổ biến</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.comboPricing}>
                <View style={styles.priceRow}>
                  <Text style={styles.originalPrice}>{combo.originalPrice}</Text>
                  <Text style={styles.discountPrice}>{combo.discountPrice}</Text>
                </View>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>Giảm {combo.discount}</Text>
                </View>
              </View>


            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Chọn Dịch Vụ Riêng Lẻ</Text>

        {serviceCategories.map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.id)}
            >
              <Text style={styles.categoryTitle}>{category.title}</Text>
                               <Ionicons
                   name={expandedService === category.id ? "chevron-up" : "chevron-down"}
                   size={24}
                   color="#1976d2"
                 />
            </TouchableOpacity>

            {expandedService === category.id && (
              <View style={styles.servicesList}>
                {category.services
                  .sort((a, b) => {
                    // Sắp xếp: dịch vụ combo lên trên, dịch vụ riêng lẻ xuống dưới
                    const aInCombo = selectedComboId && serviceCombos.find(combo => combo.id === selectedComboId)?.services.includes(a.id);
                    const bInCombo = selectedComboId && serviceCombos.find(combo => combo.id === selectedComboId)?.services.includes(b.id);
                    
                    if (aInCombo && !bInCombo) return -1;
                    if (!aInCombo && bInCombo) return 1;
                    
                    // Trong cùng nhóm, sắp xếp theo trạng thái chọn
                    const aSelected = isServiceSelected(a.id);
                    const bSelected = isServiceSelected(b.id);
                    if (aSelected && !bSelected) return -1;
                    if (!aSelected && bSelected) return 1;
                    return 0;
                  })
                  .map((service) => {
                    const isInCombo = selectedComboId && serviceCombos.find(combo => combo.id === selectedComboId)?.services.includes(service.id);
                    return (
                      <TouchableOpacity
                        key={service.id}
                        style={[
                          styles.serviceItem,
                          isServiceSelected(service.id) && styles.serviceItemSelected,
                          isInCombo && styles.comboServiceItem
                        ]}
                        onPress={() => toggleService(service.id)}
                      >
                        <View style={styles.serviceInfo}>
                          <Text style={[
                            styles.serviceName,
                            isServiceSelected(service.id) && styles.serviceNameSelected
                          ]}>
                            {service.name}
                            {isInCombo && <Text style={styles.comboLabel}> (Combo)</Text>}
                          </Text>
                          <Text style={styles.servicePrice}>{service.price}</Text>
                        </View>
                        <View style={[styles.checkbox, isServiceSelected(service.id) && styles.checkboxSelected]}>
                          {isServiceSelected(service.id) && (
                            <Ionicons name="checkmark" size={16} color="white" />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Next button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedServices.length > 0 && styles.nextButtonActive]}
          onPress={() => navigation.navigate('PersonalInfoScreen', { selectedServices, packageId: selectedComboId })}
          disabled={selectedServices.length === 0}
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

  warningContainer: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  warningText: {
    color: '#856404',
    fontSize: 12,
    textAlign: 'center',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 16,
  },
  comboSection: {
    marginBottom: 24,
  },
  comboCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comboCardSelected: {
    borderColor: '#1976d2',
    backgroundColor: '#f0f8ff',
  },
  comboHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  comboInfo: {
    flex: 1,
  },
  comboTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  comboDescription: {
    fontSize: 14,
    color: '#666',
  },
  popularBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  popularText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  comboPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  discountBadge: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  comboCheckbox: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  comboCheckboxSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  categoryContainer: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  servicesList: {
    backgroundColor: '#f8f9fa',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  serviceItemSelected: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 3,
    borderLeftColor: '#1976d2',
  },
  comboServiceItem: {
    backgroundColor: '#fff8e1',
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b35',
  },
  comboLabel: {
    color: '#ff6b35',
    fontSize: 12,
    fontWeight: '500',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  serviceNameSelected: {
    color: '#1976d2',
    fontWeight: '600',
  },
  servicePrice: {
    fontSize: 12,
    color: '#666',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#ddd',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonActive: {
    backgroundColor: '#1976d2',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingFlowScreen;
