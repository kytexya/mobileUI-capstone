import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable, Alert, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const mockPayments = [
  { id: '1', service: 'Bảo dưỡng', amount: 1200000, status: 'Chưa thanh toán' },
  { id: '2', service: 'Sửa chữa', amount: 2500000, status: 'Đã thanh toán' },
];

const onlineMethods = [
  { key: 'bank', label: 'Thẻ ngân hàng', icon: 'credit-card' },
  { key: 'momo', label: 'Momo', icon: 'cellphone' },
  { key: 'zalopay', label: 'ZaloPay', icon: 'qrcode-scan' },
  { key: 'vnpay', label: 'VNPay', icon: 'qrcode' },
];

const qrImages = {
  momo: require('../assets/banner.png'), // dùng tạm banner làm QR demo
  zalopay: require('../assets/banner.png'),
  vnpay: require('../assets/banner.png'),
};

const PaymentScreen = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(onlineMethods[0].key);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  const openPaymentModal = (item) => {
    setSelectedBill(item);
    setSelectedMethod(onlineMethods[0].key);
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCVV('');
    setModalVisible(true);
  };

  const handleConfirmPayment = () => {
    // Giả lập thanh toán thành công
    setPayments(prev => prev.map(bill =>
      bill.id === selectedBill.id ? { ...bill, status: 'Đã thanh toán' } : bill
    ));
    setModalVisible(false);
    setTimeout(() => {
      Alert.alert('Thanh toán thành công', 'Cảm ơn bạn đã thanh toán online!');
    }, 300);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thanh toán</Text>
      </View>
      <FlatList
        data={payments}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
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
              <TouchableOpacity activeOpacity={0.85} style={{ borderRadius: 12, overflow: 'hidden', marginTop: 8 }} onPress={() => openPaymentModal(item)}>
                <LinearGradient
                  colors={['#4f8cff', '#8f5cff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.payBtn}
                >
                  <Text style={styles.payBtnText}>Thanh toán</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {/* Modal thanh toán online */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thanh toán online</Text>
            {selectedBill && (
              <View style={{ marginBottom: 18 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Dịch vụ: {selectedBill.service}</Text>
                <Text style={{ fontSize: 16, color: '#007bff', marginBottom: 4 }}>Số tiền: {selectedBill.amount.toLocaleString()} VNĐ</Text>
              </View>
            )}
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Chọn phương thức thanh toán:</Text>
            {onlineMethods.map(method => (
              <Pressable
                key={method.key}
                style={[styles.methodRow, selectedMethod === method.key && styles.methodRowSelected]}
                onPress={() => setSelectedMethod(method.key)}
              >
                <MaterialCommunityIcons name={method.icon} size={22} color={selectedMethod === method.key ? '#4f8cff' : '#888'} style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 16, color: selectedMethod === method.key ? '#4f8cff' : '#222' }}>{method.label}</Text>
                {selectedMethod === method.key && (
                  <MaterialCommunityIcons name="check-circle" size={20} color="#4f8cff" style={{ marginLeft: 'auto' }} />
                )}
              </Pressable>
            ))}
            {/* Form nhập thông tin thẻ hoặc QR code */}
            {selectedMethod === 'bank' ? (
              <View style={{ marginTop: 16 }}>
                <View style={styles.inputGroup}>
                  <MaterialCommunityIcons name="credit-card-outline" size={22} color="#4f8cff" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { paddingLeft: 40 }]}
                    placeholder="Số thẻ"
                    keyboardType="number-pad"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    maxLength={19}
                    placeholderTextColor="#b0b8c1"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <MaterialCommunityIcons name="account" size={22} color="#4f8cff" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { paddingLeft: 40 }]}
                    placeholder="Tên chủ thẻ"
                    value={cardName}
                    onChangeText={setCardName}
                    autoCapitalize="characters"
                    placeholderTextColor="#b0b8c1"
                  />
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <MaterialCommunityIcons name="calendar" size={20} color="#4f8cff" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { paddingLeft: 38 }]}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      maxLength={5}
                      placeholderTextColor="#b0b8c1"
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <MaterialCommunityIcons name="lock" size={20} color="#4f8cff" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { paddingLeft: 38 }]}
                      placeholder="CVV"
                      value={cardCVV}
                      onChangeText={setCardCVV}
                      maxLength={4}
                      secureTextEntry
                      placeholderTextColor="#b0b8c1"
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.qrBox}>
                <Text style={{ marginBottom: 8, fontWeight: 'bold', color: '#1976d2', fontSize: 15 }}>Quét mã QR để thanh toán</Text>
                <View style={styles.qrFrame}>
                  <Image
                    source={qrImages[selectedMethod]}
                    style={{ width: 140, height: 140, borderRadius: 12, backgroundColor: '#fff' }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={{ color: '#888', fontSize: 13, marginTop: 6 }}>Mã QR demo</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.payBtn, { marginTop: 18, marginBottom: 6 }]}
              onPress={handleConfirmPayment}
              activeOpacity={0.85}
            >
              <Text style={styles.payBtnText}>Xác nhận thanh toán</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignItems: 'center', marginTop: 2 }}>
              <Text style={{ color: '#888', fontSize: 15 }}>Huỷ</Text>
            </TouchableOpacity>
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
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
    borderRadius: 14,
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
    marginBottom: 10,
  },
  status: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  payBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#4f8cff',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  payBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: 'Inter_500Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 26,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4f8cff',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f4f6fb',
    borderWidth: 1.2,
    borderColor: 'transparent',
    shadowColor: '#4f8cff',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  methodRowSelected: {
    backgroundColor: '#e3eaff',
    borderColor: '#4f8cff',
    borderWidth: 1.5,
    shadowOpacity: 0.13,
    elevation: 2,
  },
  input: {
    backgroundColor: '#f4f6fb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: '#e3eaff',
    color: '#222',
    fontFamily: 'Inter_400Regular',
  },
  inputGroup: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    top: 13,
    zIndex: 2,
  },
  qrBox: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 6,
  },
  qrFrame: {
    backgroundColor: '#f4f6fb',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});

export default PaymentScreen; 