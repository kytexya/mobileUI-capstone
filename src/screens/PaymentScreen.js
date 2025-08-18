import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const mockPayments = [
  { 
    id: '1', 
    service: 'Bảo dưỡng', 
    iconName: 'oil',
    color: '#FF6B35',
    bgColor: '#FFF8F3',
    amount: 1200000, 
    status: 'Chưa thanh toán' 
  },
  { 
    id: '2', 
    service: 'Sửa chữa', 
    iconName: 'wrench',
    color: '#00BCD4',
    bgColor: '#F0FDFF',
    amount: 2500000, 
    status: 'Đã thanh toán' 
  },
];

const paymentMethods = [
  { 
    key: 'bank', 
    label: 'Thẻ ngân hàng', 
    icon: 'credit-card',
    description: 'Visa, Mastercard, JCB',
    color: '#4f8cff'
  },
  { 
    key: 'zalopay', 
    label: 'ZaloPay', 
    icon: 'qrcode-scan',
    description: 'Ví điện tử ZaloPay',
    color: '#2196f3'
  },
  { 
    key: 'vnpay', 
    label: 'VNPay', 
    icon: 'qrcode',
    description: 'Cổng thanh toán VNPay',
    color: '#ff9800'
  },
  { 
    key: 'cash', 
    label: 'Tiền mặt', 
    icon: 'cash',
    description: 'Thanh toán khi nhận xe',
    color: '#4caf50'
  },
];

const PaymentScreen = ({ navigation }) => {
  const [payments, setPayments] = useState(mockPayments);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const openPaymentModal = (item) => {
    setSelectedBill(item);
    setModalVisible(true);
  };

  const selectPaymentMethod = (method) => {
    setModalVisible(false);
    navigation.navigate('PaymentDetailScreen', {
      selectedBill: selectedBill,
      selectedMethod: method.key
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thanh toán</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {payments.map((item) => (
          <View style={[styles.card, { backgroundColor: item.bgColor }]} key={item.id}>
            <View style={styles.cardHeader}>
              <View style={[styles.serviceIconContainer, { backgroundColor: item.color }]}>
                <MaterialCommunityIcons 
                  name={item.iconName} 
                  size={24} 
                  color="white" 
                />
              </View>
              <Text style={styles.service}>{item.service}</Text>
            </View>
            <View style={styles.amountRow}>
              <MaterialCommunityIcons name="currency-usd" size={18} color={item.color} style={{ marginRight: 8 }} />
              <Text style={[styles.amount, { color: item.color }]}>{item.amount.toLocaleString()} VNĐ</Text>
            </View>
            <View style={styles.statusRow}>
              {item.status === 'Đã thanh toán' ? (
                <MaterialCommunityIcons name="check-circle-outline" size={18} color="#28a745" style={{ marginRight: 6 }} />
              ) : (
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#ff5252" style={{ marginRight: 6 }} />
              )}
              <Text style={[styles.status, { color: item.status === 'Đã thanh toán' ? '#28a745' : '#ff5252' }]}>{item.status}</Text>
            </View>
            {item.status === 'Chưa thanh toán' && (
              <TouchableOpacity 
                activeOpacity={0.7} 
                style={[styles.paymentButtonContainer, { backgroundColor: item.color }]} 
                onPress={() => openPaymentModal(item)}
              >
                <MaterialCommunityIcons name="credit-card-check" size={20} color="#fff" />
                <Text style={styles.paymentButtonText}>Thanh toán ngay</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Modal chọn phương thức thanh toán */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Payment Summary */}
            {selectedBill && (
              <View style={styles.paymentSummary}>
                <View style={styles.summaryRow}>
                  <MaterialCommunityIcons name="car-cog" size={20} color="#007bff" />
                  <Text style={styles.summaryText}>{selectedBill.service}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <MaterialCommunityIcons name="currency-usd" size={20} color="#28a745" />
                  <Text style={styles.summaryAmount}>{selectedBill.amount.toLocaleString()} VNĐ</Text>
                </View>
              </View>
            )}

            {/* Payment Methods */}
            <View style={styles.methodsContainer}>
              <Text style={styles.methodsTitle}>Phương thức thanh toán</Text>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.key}
                  style={styles.methodCard}
                  onPress={() => selectPaymentMethod(method)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.methodIcon, { backgroundColor: method.color + '20' }]}>
                    <MaterialCommunityIcons 
                      name={method.icon} 
                      size={24} 
                      color={method.color} 
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodLabel}>{method.label}</Text>
                    <Text style={styles.methodDescription}>{method.description}</Text>
                  </View>
                  <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={24} 
                    color="#ccc" 
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <Text style={styles.footerText}>Thông tin thanh toán được bảo mật</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#f6f8fa',
  },
  header: {
    alignItems: 'center',
    marginTop: 38,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  service: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  paymentButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  paymentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentSummary: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginLeft: 8,
  },
  methodsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
  },
  modalFooter: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default PaymentScreen; 