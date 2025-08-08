import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const servicePackages = [
  {
    id: '1',
    name: 'Gói Bảo Dưỡng Cơ Bản',
    description: 'Bảo dưỡng định kỳ cho xe máy',
    price: 500000,
    originalPrice: 650000,
    duration: '2-3 giờ',
    items: [
      { name: 'Thay nhớt máy', price: 150000, description: 'Nhớt 4T chất lượng cao' },
      { name: 'Thay lọc gió', price: 80000, description: 'Lọc gió động cơ' },
      { name: 'Kiểm tra phanh', price: 50000, description: 'Kiểm tra và điều chỉnh phanh' },
      { name: 'Kiểm tra lốp', price: 30000, description: 'Kiểm tra áp suất và độ mòn' },
      { name: 'Vệ sinh xe', price: 100000, description: 'Vệ sinh toàn bộ xe' },
      { name: 'Kiểm tra tổng thể', price: 90000, description: 'Kiểm tra hệ thống điện, đèn' },
    ]
  },
  {
    id: '2',
    name: 'Gói Bảo Dưỡng Nâng Cao',
    description: 'Bảo dưỡng toàn diện cho xe máy',
    price: 1200000,
    originalPrice: 1500000,
    duration: '4-5 giờ',
    items: [
      { name: 'Thay nhớt máy cao cấp', price: 250000, description: 'Nhớt 4T cao cấp' },
      { name: 'Thay lọc gió', price: 80000, description: 'Lọc gió động cơ' },
      { name: 'Thay lọc nhớt', price: 120000, description: 'Lọc nhớt động cơ' },
      { name: 'Kiểm tra và điều chỉnh phanh', price: 150000, description: 'Kiểm tra, điều chỉnh và bảo dưỡng phanh' },
      { name: 'Kiểm tra và bơm lốp', price: 50000, description: 'Kiểm tra áp suất và bơm lốp' },
      { name: 'Vệ sinh xe chuyên sâu', price: 200000, description: 'Vệ sinh toàn bộ xe kỹ lưỡng' },
      { name: 'Kiểm tra hệ thống điện', price: 150000, description: 'Kiểm tra đèn, còi, đồng hồ' },
      { name: 'Kiểm tra và điều chỉnh xích', price: 100000, description: 'Kiểm tra độ căng xích' },
      { name: 'Kiểm tra ắc quy', price: 80000, description: 'Kiểm tra tình trạng ắc quy' },
      { name: 'Kiểm tra tổng thể', price: 100000, description: 'Kiểm tra tổng thể và báo cáo' },
    ]
  },
  {
    id: '3',
    name: 'Gói Sửa Chữa Tổng Thể',
    description: 'Sửa chữa và bảo dưỡng toàn diện',
    price: 2500000,
    originalPrice: 3200000,
    duration: '6-8 giờ',
    items: [
      { name: 'Thay nhớt máy cao cấp', price: 250000, description: 'Nhớt 4T cao cấp' },
      { name: 'Thay lọc gió', price: 80000, description: 'Lọc gió động cơ' },
      { name: 'Thay lọc nhớt', price: 120000, description: 'Lọc nhớt động cơ' },
      { name: 'Thay bugi', price: 150000, description: 'Bugi cao cấp' },
      { name: 'Kiểm tra và sửa chữa phanh', price: 300000, description: 'Kiểm tra, sửa chữa và thay thế nếu cần' },
      { name: 'Thay lốp (nếu cần)', price: 400000, description: 'Thay lốp mới nếu cần thiết' },
      { name: 'Vệ sinh xe chuyên sâu', price: 200000, description: 'Vệ sinh toàn bộ xe kỹ lưỡng' },
      { name: 'Kiểm tra và sửa chữa điện', price: 250000, description: 'Kiểm tra và sửa chữa hệ thống điện' },
      { name: 'Kiểm tra và điều chỉnh xích', price: 100000, description: 'Kiểm tra độ căng xích' },
      { name: 'Thay ắc quy (nếu cần)', price: 350000, description: 'Thay ắc quy mới nếu cần thiết' },
      { name: 'Kiểm tra động cơ', price: 200000, description: 'Kiểm tra chi tiết động cơ' },
      { name: 'Kiểm tra tổng thể', price: 150000, description: 'Kiểm tra tổng thể và báo cáo chi tiết' },
    ]
  }
];

const ServicePackageScreen = ({ navigation }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [expandedPackage, setExpandedPackage] = useState(null);

  const togglePackageExpansion = (packageId) => {
    setExpandedPackage(expandedPackage === packageId ? null : packageId);
  };

  const selectPackage = (pkg) => {
    setSelectedPackage(pkg);
    Alert.alert(
      'Đã chọn gói dịch vụ',
      `Bạn đã chọn: ${pkg.name}\nGiá: ${pkg.price.toLocaleString()} VNĐ`,
      [
        {
          text: 'Tiếp tục',
          onPress: () => navigation.navigate('PaymentScreen', { selectedPackage: pkg })
        },
        {
          text: 'Huỷ',
          style: 'cancel'
        }
      ]
    );
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn Gói Dịch Vụ</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Introduction */}
      <View style={styles.introCard}>
        <MaterialCommunityIcons name="package-variant" size={32} color="#007bff" />
        <Text style={styles.introTitle}>Chọn gói dịch vụ phù hợp</Text>
        <Text style={styles.introDescription}>
          Chúng tôi cung cấp các gói dịch vụ đa dạng với chi tiết giá từng hạng mục
        </Text>
      </View>

      {/* Service Packages */}
      {servicePackages.map((pkg) => (
        <View key={pkg.id} style={styles.packageCard}>
          {/* Package Header */}
          <View style={styles.packageHeader}>
            <View style={styles.packageInfo}>
              <Text style={styles.packageName}>{pkg.name}</Text>
              <Text style={styles.packageDescription}>{pkg.description}</Text>
              <View style={styles.packageMeta}>
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>{pkg.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons name="tools" size={16} color="#666" />
                  <Text style={styles.metaText}>{pkg.items.length} hạng mục</Text>
                </View>
              </View>
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.currentPrice}>{pkg.price.toLocaleString()} VNĐ</Text>
              <Text style={styles.originalPrice}>{pkg.originalPrice.toLocaleString()} VNĐ</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  -{Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Package Details */}
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => togglePackageExpansion(pkg.id)}
          >
            <Text style={styles.expandText}>
              {expandedPackage === pkg.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
            </Text>
            <MaterialCommunityIcons 
              name={expandedPackage === pkg.id ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#007bff" 
            />
          </TouchableOpacity>

          {/* Expanded Details */}
          {expandedPackage === pkg.id && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Chi tiết các hạng mục:</Text>
              {pkg.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{item.price.toLocaleString()} VNĐ</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng cộng:</Text>
                <Text style={styles.totalPrice}>{calculateTotal(pkg.items).toLocaleString()} VNĐ</Text>
              </View>
              <View style={styles.savingsRow}>
                <Text style={styles.savingsLabel}>Tiết kiệm:</Text>
                <Text style={styles.savingsAmount}>
                  {(pkg.originalPrice - pkg.price).toLocaleString()} VNĐ
                </Text>
              </View>
            </View>
          )}

          {/* Select Button */}
          <TouchableOpacity
            style={[
              styles.selectButton,
              selectedPackage?.id === pkg.id && styles.selectedButton
            ]}
            onPress={() => selectPackage(pkg)}
          >
            <LinearGradient
              colors={selectedPackage?.id === pkg.id ? ['#28a745', '#20c997'] : ['#34d399', '#10b981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <MaterialCommunityIcons 
                name={selectedPackage?.id === pkg.id ? "check-circle" : "package-variant"} 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.selectButtonText}>
                {selectedPackage?.id === pkg.id ? 'Đã chọn' : 'Chọn gói này'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ))}

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <MaterialCommunityIcons name="information-outline" size={20} color="#666" />
        <Text style={styles.bottomInfoText}>
          Giá đã bao gồm thuế VAT và phí dịch vụ
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  introCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  packageCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#007bff',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    overflow: 'hidden',
  },
  packageHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  packageInfo: {
    flex: 1,
    marginRight: 16,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  packageMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  discountText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  expandText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    marginRight: 8,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  savingsLabel: {
    fontSize: 14,
    color: '#666',
  },
  savingsAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff4757',
  },
  selectButton: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedButton: {
    shadowColor: '#28a745',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  bottomInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});

export default ServicePackageScreen;
