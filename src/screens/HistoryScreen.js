import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { DOMAIN_URL } from '../utils/Constant';
import AppConfig from '../utils/AppConfig';
import { Loading } from '../components/Loading';
import PaymentPopup from '../components/PaymentPopup';

// Timeline steps definition (same as HomeScreen)
const timelineSteps = [
  { id: 1, icon: 'clock-outline', label: 'Đặt lịch', color: '#9E9E9E' },
  { id: 2, icon: 'check-circle', label: 'Xác nhận', color: '#2196F3' },
  { id: 3, icon: 'car-wrench', label: 'Thực hiện', color: '#FF9800' },
  { id: 4, icon: 'check-all', label: 'Hoàn tất', color: '#4CAF50' },
];

const mockHistory = [
  { 
    id: '1', 
    name: 'Bảo dưỡng', 
    iconName: 'oil',
    color: '#FF6B35',
    bgColor: '#FFF3F0',
    currentStep: 4,
    timeBooked: '09:00 - 10:00',
    date: '2024-06-01',
    vehicle: {
      brand: 'Toyota',
      model: 'Vios',
      licensePlate: '30A-12345',
      year: '2022'
    }
  },
  { 
    id: '2', 
    name: 'Rửa xe', 
    iconName: 'car-wash',
    color: '#4CAF50',
    bgColor: '#F1F8E9',
    currentStep: 3,
    timeBooked: '14:00 - 15:00',
    date: '2024-06-02',
    vehicle: {
      brand: 'Honda',
      model: 'City',
      licensePlate: '51B-67890',
      year: '2021'
    }
  },
  { 
    id: '3', 
    name: 'Kiểm tra lốp', 
    iconName: 'tire',
    color: '#2196F3',
    bgColor: '#E3F2FD',
    currentStep: 4,
    timeBooked: '08:00 - 09:00',
    date: '2024-05-30',
    vehicle: {
      brand: 'Mitsubishi',
      model: 'Xpander',
      licensePlate: '29C-11111',
      year: '2023'
    }
  },
];

// Component Timeline để hiển thị trạng thái theo bước (same as HomeScreen)
const ServiceTimeline = ({ currentStep, serviceColor }) => {
  return (
    <View style={styles.timelineContainer}>
      {timelineSteps.map((step, index) => {
        const isCompleted = step.id <= currentStep;
        const isCurrent = step.id === currentStep;
        const isLast = index === timelineSteps.length - 1;
        
        return (
          <View key={step.id} style={styles.timelineStep}>
            {/* Step icon */}
            <View style={[
              styles.timelineIcon,
              {
                backgroundColor: isCompleted ? (isCurrent ? serviceColor : step.color) : '#E0E0E0',
                borderColor: isCompleted ? (isCurrent ? serviceColor : step.color) : '#E0E0E0',
              }
            ]}>
              <MaterialCommunityIcons
                name={step.icon}
                size={12}
                color={isCompleted ? 'white' : '#9E9E9E'}
              />
            </View>
            
            {/* Connector line */}
            {!isLast && (
              <View style={[
                styles.timelineConnector,
                {
                  backgroundColor: step.id < currentStep ? step.color : '#E0E0E0'
                }
              ]} />
            )}
            
            {/* Step label */}
            <Text style={[
              styles.timelineLabel,
              {
                color: isCurrent ? serviceColor : (isCompleted ? '#333' : '#9E9E9E'),
                fontWeight: isCurrent ? 'bold' : 'normal'
              }
            ]}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const getHistory = () => {
    setLoading(true);
    axios
      .get(`${DOMAIN_URL}/Appointment/GetByCustomerId/${AppConfig.USER_ID}`, {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        setHistory(response.data);
        console.log("res ", response.data);
      })
      .catch(function (error) {
        Alert.alert(
          "Lỗi",
          "Đã xảy ra lỗi, vui lòng thử lại!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      })
      .finally(function () {
        setLoading(false);
      });
  };

  useEffect(() => {
    getHistory();
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoạt động 2</Text>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {mockHistory.map((service) => (
          <View key={service.id} style={[styles.serviceCard, { backgroundColor: service.bgColor }]}>
            {/* Header with icon and info */}
            <View style={styles.serviceHeader}>
              <View style={[styles.serviceIconContainer, { backgroundColor: service.color }]}>
                <MaterialCommunityIcons 
                  name={service.iconName} 
                  size={24} 
                  color="white" 
                />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceTime}>{service.timeBooked} • {service.date}</Text>
              </View>
            </View>
            
            {/* Vehicle Info */}
            <View style={styles.vehicleInfoCard}>
              <MaterialCommunityIcons 
                name="car" 
                size={16} 
                color={service.color} 
                style={styles.vehicleIcon}
              />
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleName}>
                  {service.vehicle.brand} {service.vehicle.model} ({service.vehicle.year})
                </Text>
                <Text style={styles.vehiclePlate}>
                  {service.vehicle.licensePlate}
                </Text>
              </View>
            </View>
            
            {/* Timeline */}
            <ServiceTimeline 
              currentStep={service.currentStep}
              serviceColor={service.color}
            />
          </View>
        ))}
      </ScrollView>
      <PaymentPopup setModalVisible={setModalVisible} modalVisible={modalVisible} />
      <Loading show={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f6f8fa' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 18, 
    textAlign: 'left', 
    color: '#333', 
    marginTop: 24 
  },
  
  // Service card styles
  serviceCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceHeader: {
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
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  serviceTime: {
    fontSize: 14,
    color: '#666',
  },
  
  // Vehicle info styles
  vehicleInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  vehicleIcon: {
    marginRight: 8,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  vehiclePlate: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 1,
  },
  
  // Timeline styles
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 6,
    zIndex: 2,
  },
  timelineConnector: {
    position: 'absolute',
    top: 12,
    left: '50%',
    right: '-50%',
    height: 2,
    zIndex: 1,
  },
  timelineLabel: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default HistoryScreen; 