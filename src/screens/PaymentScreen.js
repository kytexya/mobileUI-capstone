import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const mockPayments = [
  { id: '1', service: 'Bảo dưỡng', amount: 1200000, status: 'Chưa thanh toán' },
  { id: '2', service: 'Sửa chữa', amount: 2500000, status: 'Đã thanh toán' },
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
          <View style={styles.card} key={item.id}>
            <View style={styles.cardHeader}>
              {item.service === 'Bảo dưỡng' ? (
                <MaterialCommunityIcons name="car-cog" size={28} color="#1976d2" style={{ marginRight: 10 }} />
              ) : (
                <MaterialCommunityIcons name="wrench" size={28} color="#1976d2" style={{ marginRight: 10 }} />
              )}
              <Text style={styles.service}>{item.service}</Text>
            </View>
            <View style={styles.amountRow}>
              <MaterialCommunityIcons name="credit-card-outline" size={20} color="#28a745" style={{ marginRight: 6 }} />
              <Text style={styles.amount}>{item.amount.toLocaleString()} VNĐ</Text>
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
                activeOpacity={0.85} 
                style={styles.paymentButtonContainer} 
                onPress={() => openPaymentModal(item)}
              >
                <LinearGradient
                  colors={['#4f8cff', '#8f5cff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.paymentButton}
                >
                  <MaterialCommunityIcons name="credit-card-check" size={24} color="#fff" />
                  <Text style={styles.paymentButtonText}>Thanh toán ngay</Text>
                </LinearGradient>
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
    backgroundColor: '#f4f6fb',
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 18,
    marginBottom: 18,
    shadowColor: '#007bff',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  service: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  status: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  paymentButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4f8cff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  paymentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
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
    borderRadius: 24,
    padding: 0,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
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
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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