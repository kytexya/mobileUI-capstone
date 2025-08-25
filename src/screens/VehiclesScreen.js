import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AppConfig from "../utils/AppConfig";
import { DOMAIN_URL } from "../utils/Constant";
import { Loading } from "../components/Loading";

const VehiclesScreen = ({navigation}) => {
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    model: "",
    licensePlate: "",
    year: "",
    color: "",
  });

  const deleteVehicle = (vehicleId) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa xe này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          setLoading(true);
          axios
            .delete(`${DOMAIN_URL}/Vehicle/remove/${vehicleId}`, {
              headers: {
                Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
                "Content-Type": "application/json",
              },
            })
            .then(function (response) {
              getVehicle();
              Alert.alert(
                "Thành công!",
                "Đã xóa thành công!",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            })
            .catch(function (error) {
              setLoading(false)
              Alert.alert(
                "Lỗi",
                "Đã xảy ra lỗi, vui lòng thử lại!",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            })
            .finally(function () {
              setLoading(false)
            });
        },
      },
    ]);
  };

  const addVehicle = () => {
    setLoading(true);
    if (
      newVehicle.model &&
      newVehicle.licensePlate &&
      newVehicle.year &&
      newVehicle.color
    ) {
      const vehicleToAdd = {
        id: Date.now(),
        ...newVehicle,
      };
      setVehicles((prev) => [...prev, vehicleToAdd]);
      setShowAddVehicleModal(false);
      setNewVehicle({ model: "", licensePlate: "", year: "", color: "" });
    }

    const dataSubmit = {
      licensePlate: newVehicle.licensePlate,
      make: newVehicle.color,
      model: newVehicle.model,
      year: newVehicle.year,
      carTypeId: newVehicle?.carTypeId ?? 1,
    };

    axios
      .post(
        `${DOMAIN_URL}/Vehicle/add?customerId=${AppConfig.USER_ID}`,
        dataSubmit
      )
      .then(function (response) {
        setShowAddVehicleModal(false);
        getVehicle();
      })
      .catch(function (error) {
        setLoading(false)
        Alert.alert(
          "Lỗi",
          "Đã xảy ra lỗi, vui lòng thử lại!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      })
      .finally(function () {
      });
  };

  const getVehicle = () => {
    if (!loading) {
      setLoading(true);
    }
    axios
      .get(`${DOMAIN_URL}/Vehicle/customer/${AppConfig.USER_ID}`, {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        setVehicles(response.data);
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
    getVehicle();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1976d2" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="car" size={24} color="#1976d2" />
          <Text style={styles.headerTitle}>Quản lý xe của bạn</Text>
        </View>
      </View>

      {/* Vehicle List */}
      <ScrollView style={styles.content}>
        {vehicles?.length > 0 && vehicles.map((vehicle) => (
          <View key={vehicle.vehicleId} style={styles.vehicleCard}>
            {/* Header with car info and status */}
            <View style={styles.vehicleHeader}>
              <View style={styles.vehicleMainInfo}>
                <View style={styles.vehicleIcon}>
                  <MaterialCommunityIcons
                    name="car"
                    size={24}
                    color="#1976d2"
                  />
                </View>
                <View style={styles.vehicleText}>
                  <Text style={styles.vehicleModel}>
                    {vehicle.brand} {vehicle.model}
                  </Text>
                  <Text style={styles.vehicleLicense}>
                    {vehicle.licensePlate}
                  </Text>
                </View>
              </View>
              <View style={styles.vehicleActions}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        vehicle.status === "Hoạt động" ? "#E8F5E8" : "#FFF3E0",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      vehicle.status === "Hoạt động"
                        ? "check-circle"
                        : "alert-circle"
                    }
                    size={12}
                    color={
                      vehicle.status === "Hoạt động" ? "#4CAF50" : "#FF9800"
                    }
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          vehicle.status === "Hoạt động"
                            ? "#4CAF50"
                            : "#FF9800",
                      },
                    ]}
                  >
                    {vehicle.status}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteVehicle(vehicle.vehicleId)}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Vehicle specs */}
            <View style={styles.vehicleSpecs}>
              <View style={styles.specBadge}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={14}
                  color="#1976d2"
                />
                <Text style={styles.specText}>{vehicle.year}</Text>
              </View>
              <View style={styles.specBadge}>
                <MaterialCommunityIcons
                  name="palette"
                  size={14}
                  color="#FF6B35"
                />
                <Text style={styles.specText}>{vehicle.make}</Text>
              </View>
            </View>

            {/* Service info */}
            <View style={styles.serviceInfo}>
              <View style={styles.serviceItem}>
                <MaterialCommunityIcons
                  name="wrench"
                  size={14}
                  color="#4CAF50"
                />
                <Text style={styles.serviceLabel}>Bảo dưỡng cuối:</Text>
                <Text style={styles.serviceDate}>{vehicle.lastService}</Text>
              </View>
              <View style={styles.serviceItem}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={14}
                  color="#FF9800"
                />
                <Text style={styles.serviceLabel}>Bảo dưỡng tiếp:</Text>
                <Text style={styles.serviceDate}>{vehicle.nextService}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Vehicle Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddVehicleModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Thêm xe mới</Text>
        </TouchableOpacity>
      </View>

      {/* Add Vehicle Modal */}
      <Modal
        visible={showAddVehicleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddVehicleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="car" size={32} color="#1976d2" />
              <Text style={styles.modalTitle}>Thêm xe mới</Text>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Hãng xe *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="VD: Toyota, Honda, Ford..."
                  value={newVehicle.brand}
                  onChangeText={(text) =>
                    setNewVehicle((prev) => ({ ...prev, brand: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Tên xe *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="VD: Vios, City, Ranger..."
                  value={newVehicle.model}
                  onChangeText={(text) =>
                    setNewVehicle((prev) => ({ ...prev, model: text }))
                  }
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Biển số xe *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="VD: 30A-12345"
                  value={newVehicle.licensePlate}
                  onChangeText={(text) =>
                    setNewVehicle((prev) => ({
                      ...prev,
                      licensePlate: text.toUpperCase(),
                    }))
                  }
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Năm sản xuất *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="VD: 2022"
                  value={newVehicle.year}
                  onChangeText={(text) =>
                    setNewVehicle((prev) => ({ ...prev, year: text }))
                  }
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Màu sắc *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="VD: Trắng, Đen, Xanh..."
                  value={newVehicle.color}
                  onChangeText={(text) =>
                    setNewVehicle((prev) => ({ ...prev, color: text }))
                  }
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!newVehicle.model ||
                    !newVehicle.licensePlate ||
                    !newVehicle.year ||
                    !newVehicle.color) &&
                    styles.saveButtonDisabled,
                ]}
                onPress={addVehicle}
                disabled={
                  !newVehicle.model ||
                  !newVehicle.licensePlate ||
                  !newVehicle.year ||
                  !newVehicle.color
                }
              >
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddVehicleModal(false);
                  setNewVehicle({
                    model: "",
                    licensePlate: "",
                    year: "",
                    color: "",
                  });
                }}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Loading show={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fa",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  vehicleCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  // New detailed card styles
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  vehicleMainInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  vehicleText: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  vehicleLicense: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976d2",
  },
  vehicleActions: {
    alignItems: "flex-end",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  vehicleSpecs: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 12,
  },
  specBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  specText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginLeft: 5,
  },
  serviceInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  serviceLabel: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  serviceDate: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  addButton: {
    backgroundColor: "#1976d2",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "85%",
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  modalForm: {
    width: "100%",
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    color: "#333",
  },
  modalFooter: {
    width: "100%",
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: "#1976d2",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 68, 68, 0.2)",
    backgroundColor: "rgba(255, 68, 68, 0.05)",
  },
  cancelButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default VehiclesScreen;
