import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AppConfig from "../utils/AppConfig";
import { DOMAIN_URL } from "../utils/Constant";
import { Loading } from "../components/Loading";
import PaymentPopup from "../components/PaymentPopup";
import {
  formatDate,
  formatTime,
  formatVND,
  generateStepAppointmentColor,
  convertStatusToStep,
} from "../utils/Utils";
import { useFocusEffect } from "@react-navigation/native";
import { useLoading } from "../components/LoadingContext";

// Timeline steps definition (same as HomeScreen)
const timelineSteps = [
  { id: 1, icon: "clock-outline", label: "Đặt lịch", color: "#9E9E9E" },
  { id: 2, icon: "check-circle", label: "Xác nhận", color: "#2196F3" },
  { id: 3, icon: "car-wrench", label: "Thực hiện", color: "#9C27B0" },
  { id: 4, icon: "check-all", label: "Hoàn tất", color: "#4CAF50" },
];

const mockOngoing = [
  {
    id: "1",
    name: "Bảo dưỡng",
    iconName: "oil",
    color: "#FF6B35",
    bgColor: "#FFF8F3",
    currentStep: 2,
    timeBooked: "09:00 - 10:00",
    date: "2024-06-01",
    estimatedDuration: "90 phút",
    price: 350000,
    mechanic: "Nguyễn Văn An",
    location: "Garage A - Khu vực 1",
    services: ["Thay dầu động cơ", "Kiểm tra phanh", "Bảo dưỡng định kỳ"],
    vehicle: {
      brand: "Toyota",
      model: "Vios",
      licensePlate: "30A-12345",
      year: "2022",
      color: "Trắng",
    },
  },
  {
    id: "2",
    name: "Rửa xe",
    iconName: "car-wash",
    color: "#00BCD4",
    bgColor: "#F0FDFF",
    currentStep: 3,
    timeBooked: "14:00 - 15:00",
    date: "2024-06-02",
    estimatedDuration: "45 phút",
    price: 150000,
    mechanic: "Trần Thị Bình",
    location: "Garage B - Khu vực 2",
    services: ["Rửa xe cao cấp", "Vệ sinh nội thất", "Đánh bóng xe"],
    vehicle: {
      brand: "Honda",
      model: "City",
      licensePlate: "51B-67890",
      year: "2021",
      color: "Đen",
    },
  },
];

const mockHistory = [
  {
    id: "3",
    name: "Kiểm tra lốp",
    iconName: "tire",
    color: "#4CAF50",
    bgColor: "#F1F8F4",
    currentStep: 4,
    timeBooked: "08:00 - 09:00",
    date: "2024-05-28",
    estimatedDuration: "30 phút",
    price: "100.000đ",
    mechanic: "Lê Văn Cường",
    location: "Garage C - Khu vực 3",
    services: ["Kiểm tra áp suất lốp", "Kiểm tra độ mòn lốp", "Cân bằng lốp"],
    completedAt: "09:15 AM",
    vehicle: {
      brand: "Mitsubishi",
      model: "Xpander",
      licensePlate: "29C-11111",
      year: "2023",
      color: "Bạc",
    },
  },
];

export const stepMock = [1, 2, 3, 4];

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
            <View
              style={[
                styles.timelineIcon,
                {
                  backgroundColor: isCompleted
                    ? isCurrent
                      ? serviceColor
                      : step.color
                    : "#E0E0E0",
                  borderColor: isCompleted
                    ? isCurrent
                      ? serviceColor
                      : step.color
                    : "#E0E0E0",
                },
              ]}
            >
              <MaterialCommunityIcons
                name={step.icon}
                size={12}
                color={isCompleted ? "white" : "#9E9E9E"}
              />
            </View>

            {/* Connector line */}
            {!isLast && (
              <View
                style={[
                  styles.timelineConnector,
                  {
                    backgroundColor:
                      step.id < currentStep ? step.color : "#E0E0E0",
                  },
                ]}
              />
            )}

            {/* Step label */}
            <Text
              style={[
                styles.timelineLabel,
                {
                  color: isCurrent
                    ? serviceColor
                    : isCompleted
                    ? "#333"
                    : "#9E9E9E",
                  fontWeight: isCurrent ? "bold" : "normal",
                },
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const ActivityScreen = ({ route, navigation }) => {
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [appointmentOnGoing, setAppointmentOnGoing] = useState([]);
  const { setLoading } = useLoading();
  const [modalVisible, setModalVisible] = useState(false);
  const [itemPayment, setItemPayment] = useState({});

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
        console.log("GetByCustomerId ",response);
        
        const newData = response.data.map((e) => ({
          ...e,
          name: "Bảo dưỡng",
          timeBooked: formatTime(e.bookedTime),
          currentStep: convertStatusToStep(e.status),
        }));
        setAppointmentHistory(newData);
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

  const getAppointmentOngoing = () => {
    setLoading(true);
    axios
      .get(
        `${DOMAIN_URL}/Appointment/GetOngoingByCustomerId/${AppConfig.USER_ID}`,
        {
          headers: {
            Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log("GetOngoingByCustomerId ",response);

        const newData = response.data.map((e) => ({
          ...e,
          name: "Bảo dưỡng",
          timeBooked: formatTime(e.bookedTime),
          currentStep: convertStatusToStep(e.status),
        }));
        setAppointmentOnGoing(newData);
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

  // Get navigation params
  const initialTab = route?.params?.initialTab || "ongoing";
  const serviceId = route?.params?.serviceId;

  const [activeTab, setActiveTab] = useState(initialTab);
  const data =
    activeTab === "ongoing" ? appointmentOnGoing : appointmentHistory;

  // Update tab when navigation params change
  useEffect(() => {
    if (route?.params?.initialTab) {
      setActiveTab(route.params.initialTab);

      // Clear params after setting tab to avoid issues on subsequent navigations
      navigation.setParams({ initialTab: undefined, serviceId: undefined });
    }
  }, [route?.params?.initialTab, navigation]);

  // useEffect(() => {
  //   getHistory();
  //   getAppointmentOngoing();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getHistory();
      getAppointmentOngoing();
      return () => {};
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Hoạt động</Text>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={styles.tabBtn}
            onPress={() => setActiveTab("ongoing")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "ongoing" && styles.tabTextActive,
              ]}
            >
              Đang diễn ra
            </Text>
            {activeTab === "ongoing" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabBtn}
            onPress={() => setActiveTab("history")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "history" && styles.tabTextActive,
              ]}
            >
              Lịch sử
            </Text>
            {activeTab === "history" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24, marginTop: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {data.map((history) => (
            <TouchableOpacity
              key={history.appointmentId}
              onPress={() => {
                setItemPayment(history);
                setModalVisible(true);
              }}
            >
              <View
                style={[
                  styles.serviceCard,
                  {
                    backgroundColor:
                      generateStepAppointmentColor(history.currentStep)
                        .bgColor ?? "#FFF8F3",
                  },
                ]}
              >
                {/* Header with icon and info */}
                <View style={styles.serviceHeader}>
                  <View
                    style={[
                      styles.serviceIconContainer,
                      {
                        backgroundColor: generateStepAppointmentColor(
                          history.currentStep
                        ).color,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={history.iconName ?? "tire"}
                      size={24}
                      color="white"
                    />
                  </View>
                  <View style={styles.serviceInfo}>
                    <View style={styles.serviceTitleRow}>
                      <Text style={styles.serviceName}>
                        {history.name ?? "Bảo dưỡng"}
                      </Text>
                      <Text style={styles.servicePrice}>
                        {formatVND(history.price)}
                      </Text>
                    </View>
                    <Text style={styles.serviceTime}>
                      {history.timeBooked} •{" "}
                      {formatDate(new Date(history.appointmentDate))}
                    </Text>
                    <Text style={styles.serviceDuration}>
                      ⏱ {history.duration} giờ
                    </Text>
                  </View>
                </View>

                {/* Vehicle Info */}
                <View style={styles.vehicleInfoCard}>
                  <MaterialCommunityIcons
                    name="car"
                    size={16}
                    color={
                      generateStepAppointmentColor(history.currentStep).color
                    }
                    style={styles.vehicleIcon}
                  />
                  <View style={styles.vehicleDetails}>
                    <Text style={styles.vehicleName}>
                      {history.vehicleModel} ({history.vehicleYear ?? 2025})
                    </Text>
                    <View style={styles.vehicleSubInfo}>
                      <Text style={styles.vehiclePlate}>
                        {history.vehicleLicensePlate}
                      </Text>
                      <Text style={styles.vehicleSpecs}>
                        {history.vehicleMake}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Mechanic & Location Info */}
                <View style={styles.detailsSection}>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons
                      name="account-wrench"
                      size={16}
                      color={
                        generateStepAppointmentColor(history.currentStep).color
                      }
                    />
                    <Text style={styles.detailText}>
                      Thợ: {history.staffName}
                    </Text>
                  </View>
                  {/* <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="map-marker" size={16} color={history.color} />
                    <Text style={styles.detailText}>{history.location ?? "Chưa xác định"}</Text>
                  </View> */}
                </View>

                {/* Services List */}
                <View style={styles.servicesSection}>
                  <Text style={styles.sectionTitle}>Dịch vụ bao gồm:</Text>
                  <View style={styles.servicesList}>
                    {history.services.map((item, index) => (
                      <View key={index + 999} style={styles.serviceItem}>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={14}
                          color={
                            generateStepAppointmentColor(history.currentStep)
                              .color
                          }
                        />
                        <Text style={styles.serviceItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Completed time for finished services */}
                {history.currentStep === 4 && history.completedAt && (
                  <View style={styles.completedSection}>
                    <Text style={styles.completedText}>
                      Hoàn thành lúc: {history.completedAt}
                    </Text>
                  </View>
                )}

                {/* Timeline */}
                <ServiceTimeline
                  currentStep={history.currentStep ?? 1}
                  serviceColor={
                    generateStepAppointmentColor(history.currentStep).color ??
                    ""
                  }
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <PaymentPopup
        itemPayment={itemPayment}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
    backgroundColor: "#f6f8fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "left",
    color: "#333",
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
    marginTop: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#e0f2f1",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 6,
  },
  tabText: {
    fontSize: 16,
    color: "#aaa",
    fontWeight: "bold",
  },
  tabTextActive: {
    color: "#009ca6",
  },
  tabUnderline: {
    height: 3,
    backgroundColor: "#1de9b6",
    borderRadius: 2,
    marginTop: 4,
    width: 60,
    alignSelf: "center",
  },

  // Service card styles
  serviceCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  serviceTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  serviceDuration: {
    fontSize: 12,
    color: "#666",
  },

  // Vehicle info styles
  vehicleInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  vehicleIcon: {
    marginRight: 8,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  vehicleSubInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vehiclePlate: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#666",
    letterSpacing: 1,
  },
  vehicleSpecs: {
    fontSize: 12,
    color: "#999",
  },

  // Timeline styles
  timelineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  timelineStep: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginBottom: 6,
    zIndex: 2,
  },
  timelineConnector: {
    position: "absolute",
    top: 12,
    left: "50%",
    right: "-50%",
    height: 2,
    zIndex: 1,
  },
  timelineLabel: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
  },

  // New detailed sections styles
  detailsSection: {
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },

  servicesSection: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  servicesList: {
    marginLeft: 4,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceItemText: {
    fontSize: 13,
    color: "#555",
    marginLeft: 8,
    flex: 1,
  },

  completedSection: {
    marginVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 8,
    padding: 12,
  },
  completedText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
});

export default ActivityScreen;
