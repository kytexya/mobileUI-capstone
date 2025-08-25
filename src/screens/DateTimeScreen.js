import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AppConfig from '../utils/AppConfig';

const DateTimeScreen = ({ navigation, route }) => {
  const { selectedServices, personalInfo, vehicleOption, selectedVehicle, packageId } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState('none');
  const [showMechanicModal, setShowMechanicModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(8); // Tháng hiện tại (8 = Tháng 8)
  const [currentYear, setCurrentYear] = useState(2025);
  const [mechanics, setMechanics] = useState([])

  // Mock data cho danh sách nhân viên
  const mechanics1 = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      specialty: 'Động cơ & Hộp số',
      experience: '5 năm',
      rating: 4.8,
      avatar: '👨‍🔧'
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      specialty: 'Hệ thống điện',
      experience: '3 năm',
      rating: 4.6,
      avatar: '👩‍🔧'
    },
    {
      id: 3,
      name: 'Lê Văn Cường',
      specialty: 'Hệ thống phanh',
      experience: '7 năm',
      rating: 4.9,
      avatar: '👨‍🔧'
    },
    {
      id: 4,
      name: 'Phạm Thị Dung',
      specialty: 'Điều hòa & Làm mát',
      experience: '4 năm',
      rating: 4.7,
      avatar: '👩‍🔧'
    }
  ];

  // Mock data cho slot có sẵn/không có sẵn
  const timeSlots = [
    { time: '08:00', available: true },
    { time: '09:00', available: false },
    { time: '10:00', available: true },
    { time: '11:00', available: true },
    { time: '12:00', available: false },
    { time: '13:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: false },
    { time: '16:00', available: true },
    { time: '17:00', available: true }
  ];

  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate(); // Lấy số ngày trong tháng
    const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // Ngày đầu tiên của tháng (0 = CN, 1 = T2, ...)
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Chuyển đổi để T2 = 0
    
    // Add empty days for the beginning of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({ day: '', empty: true });
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, empty: false });
    }
    
    return days;
  };

  const getMonthName = (month) => {
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return monthNames[month - 1];
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null); // Reset selected date when changing month
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null); // Reset selected date when changing month
  };

    const getMechanics = () => {
    axios
      .get(`${DOMAIN_URL}/Account/service-staff`, {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        setMechanics(response.data);
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

  const handleContinute = () => {    
    navigation.navigate('ConfirmationScreen', {
      selectedServices,
      personalInfo,
      vehicleOption,
      selectedVehicle,
      selectedDate: {
        date: selectedDate < 10 ? `0${selectedDate}` : selectedDate,
        month: currentMonth < 10 ? `0${currentMonth}` : currentMonth,
        year: currentYear
      },
      selectedTime,
      selectedMechanic,
      packageId
    })
  }

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

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
              <View key={step} style={[styles.progressStep, step === 3 && styles.activeStep]}>
                <Text style={[styles.stepNumber, step === 3 && styles.activeStepText]}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Mechanic Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            Bạn có thể chọn một thợ để sửa chữa chiếc xe của bạn
          </Text>
          
                     <View style={styles.mechanicOption}>
             {selectedMechanic === 'none' ? (
               <TouchableOpacity
                 style={styles.radioContainer}
                 onPress={() => setSelectedMechanic('none')}
               >
                 <View style={[styles.radioButton, selectedMechanic === 'none' && styles.radioSelected]}>
                   {selectedMechanic === 'none' && (
                     <View style={styles.radioInner} />
                   )}
                 </View>
                 <Text style={styles.radioLabel}>Không chỉ định</Text>
               </TouchableOpacity>
             ) : (
               <View style={styles.mechanicInfoContainer}>
                 <Text style={styles.mechanicName}>
                   {mechanics.find(m => m.id === selectedMechanic)?.name}
                 </Text>
               </View>
             )}
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => setShowMechanicModal(true)}
            >
              <Text style={styles.selectButtonText}>Chọn</Text>
            </TouchableOpacity>
          </View>
                     <Text style={styles.helperText}>
             {selectedMechanic === 'none' 
               ? 'Hệ thống sẽ tự động phân công thợ phù hợp'
               : `${mechanics.find(m => m.id === selectedMechanic)?.specialty} • ${mechanics.find(m => m.id === selectedMechanic)?.experience} • ⭐${mechanics.find(m => m.id === selectedMechanic)?.rating}`
             }
           </Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày</Text>
          
          <View style={styles.calendarHeader}>
            <TouchableOpacity style={styles.monthButton} onPress={goToPreviousMonth}>
              <Ionicons name="chevron-back" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{getMonthName(currentMonth)} năm {currentYear}</Text>
            <TouchableOpacity style={styles.monthButton} onPress={goToNextMonth}>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.calendar}>
            {/* Week days header */}
            <View style={styles.weekDaysRow}>
              {weekDays.map((day) => (
                <View key={day} style={styles.weekDay}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar days */}
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    item.empty && styles.emptyDay,
                    selectedDate === item.day && styles.selectedDay
                  ]}
                  onPress={() => !item.empty && setSelectedDate(item.day)}
                  disabled={item.empty}
                >
                  <Text style={[
                    styles.dayText,
                    selectedDate === item.day && styles.selectedDayText
                  ]}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn thời gian</Text>
          
          <View style={styles.timeGrid}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.timeSlot,
                  !slot.available && styles.unavailableTimeSlot,
                  selectedTime === slot.time && slot.available && styles.selectedTimeSlot
                ]}
                onPress={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
              >
                <Text style={[
                  styles.timeText,
                  !slot.available && styles.unavailableTimeText,
                  selectedTime === slot.time && slot.available && styles.selectedTimeText
                ]}>
                  {slot.time}
                </Text>
                {!slot.available && (
                  <Text style={styles.unavailableLabel}>Đã đặt</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Next button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!selectedDate || !selectedTime) && styles.nextButtonDisabled
          ]}
          onPress={() => {
            handleContinute()
          }}
          disabled={!selectedDate || !selectedTime}
        >
          <Text style={[
            styles.nextButtonText,
            (!selectedDate || !selectedTime) && styles.nextButtonTextDisabled
          ]}>
            Tiếp theo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mechanic Selection Modal */}
      <Modal
        visible={showMechanicModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMechanicModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn nhân viên</Text>
              <TouchableOpacity 
                onPress={() => setShowMechanicModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.mechanicList}>
              {/* Option: Không chỉ định */}
              <TouchableOpacity
                style={[
                  styles.mechanicItem,
                  selectedMechanic === 'none' && styles.mechanicItemSelected
                ]}
                onPress={() => {
                  setSelectedMechanic('none');
                  setShowMechanicModal(false);
                }}
              >
                <View style={styles.mechanicInfo}>
                  <Text style={styles.mechanicName}>Không chỉ định</Text>
                  <Text style={styles.mechanicSpecialty}>Hệ thống sẽ tự động phân công thợ phù hợp</Text>
                </View>
                <View style={[
                  styles.mechanicCheckbox,
                  selectedMechanic === 'none' && styles.mechanicCheckboxSelected
                ]}>
                  {selectedMechanic === 'none' && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Danh sách nhân viên */}
              {mechanics.map((mechanic) => (
                <TouchableOpacity
                  key={mechanic.id}
                  style={[
                    styles.mechanicItem,
                    selectedMechanic === mechanic.id && styles.mechanicItemSelected
                  ]}
                  onPress={() => {
                    setSelectedMechanic(mechanic.id);
                    setShowMechanicModal(false);
                  }}
                >
                  <View style={styles.mechanicAvatar}>
                    <Text style={styles.avatarText}>{mechanic.avatar}</Text>
                  </View>
                  <View style={styles.mechanicInfo}>
                    <Text style={styles.mechanicName}>{mechanic.name}</Text>
                    <Text style={styles.mechanicSpecialty}>{mechanic.specialty}</Text>
                    <View style={styles.mechanicDetails}>
                      <Text style={styles.mechanicExperience}>{mechanic.experience}</Text>
                      <Text style={styles.mechanicRating}>⭐ {mechanic.rating}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.mechanicCheckbox,
                    selectedMechanic === mechanic.id && styles.mechanicCheckboxSelected
                  ]}>
                    {selectedMechanic === mechanic.id && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  mechanicOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#1976d2',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1976d2',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  mechanicInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 32,
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: '600',
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
  helperText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  calendar: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  selectedDay: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedTimeSlot: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#1976d2',
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
  selectedTimeText: {
    color: '#fff'
  },
  unavailableTimeSlot: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    opacity: 0.6,
  },
  unavailableTimeText: {
    color: '#999',
  },
  unavailableLabel: {
    fontSize: 10,
    color: '#ff4444',
    marginTop: 2,
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
  mechanicList: {
    maxHeight: 400,
  },
  mechanicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  mechanicItemSelected: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 3,
    borderLeftColor: '#1976d2',
  },
  mechanicAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mechanicSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mechanicDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mechanicExperience: {
    fontSize: 12,
    color: '#999',
    marginRight: 12,
  },
  mechanicRating: {
    fontSize: 12,
    color: '#ff9800',
  },
  mechanicCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mechanicCheckboxSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
});

export default DateTimeScreen;
