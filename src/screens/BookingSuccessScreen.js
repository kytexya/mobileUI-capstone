import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BookingSuccessScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={60} color="white" />
            </View>
          </View>

          {/* Success Message */}
          <Text style={styles.title}>Đặt Lịch Thành Công!</Text>
          <Text style={styles.subtitle}>
            Chúng tôi đã nhận được yêu cầu đặt lịch của bạn
          </Text>

          {/* Booking Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Thông tin đặt lịch</Text>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="#4CAF50" />
              <Text style={styles.detailText}>Mã đặt lịch: #BK2024001</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="mail" size={16} color="#4CAF50" />
              <Text style={styles.detailText}>Email xác nhận đã được gửi</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="notifications" size={16} color="#4CAF50" />
              <Text style={styles.detailText}>SMS nhắc nhở sẽ được gửi trước 1 giờ</Text>
            </View>
          </View>

          {/* Next Steps */}
          <View style={styles.nextStepsCard}>
            <Text style={styles.nextStepsTitle}>Bước tiếp theo</Text>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Kiểm tra email để xem chi tiết đặt lịch</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Đến đúng giờ đã đặt lịch</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Mang theo giấy tờ xe và mã đặt lịch</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Cần hỗ trợ?</Text>
            <Text style={styles.contactText}>
              Liên hệ chúng tôi qua hotline: 1900-xxxx
            </Text>
          </View>

          {/* New Booking Option */}
          <View style={styles.newBookingCard}>
            <Text style={styles.newBookingTitle}>Muốn sửa xe khác?</Text>
            <Text style={styles.newBookingText}>
              Bây giờ bạn có thể tạo lịch mới cho xe khác để đảm bảo chất lượng dịch vụ tốt nhất
            </Text>
            <TouchableOpacity 
              style={styles.newBookingButton}
              onPress={() => {
                navigation.navigate('BookingFlowScreen');
              }}
            >
              <Text style={styles.newBookingButtonText}>Tạo lịch mới</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.primaryButtonText}>Về Trang Chủ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('HistoryScreen')}
        >
          <Text style={styles.secondaryButtonText}>Xem Lịch Sử Đặt Lịch</Text>
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
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  detailsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  nextStepsCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: '#2e7d32',
    flex: 1,
  },
  contactCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#856404',
  },
  newBookingCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#1976d2',
  },
  newBookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  newBookingText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 12,
    lineHeight: 20,
  },
  newBookingButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  newBookingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#fff'
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
});

export default BookingSuccessScreen;
