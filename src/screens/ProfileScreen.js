import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { DOMAIN_URL } from "../utils/Constant";
import AppConfig from "../utils/AppConfig";
import { FormProvider, useForm } from "react-hook-form";
import InputForm from "../components/InputForm";
import { emailRegex, phoneRegex } from "../utils/validator";
import { Loading } from "../components/Loading";
import { useLoading } from "../components/LoadingContext";

const ProfileScreen = ({ navigation }) => {
  const methods = useForm({
    defaultValues: {
      name: AppConfig.USER_OBJ.fullName,
      email: AppConfig.USER_OBJ.email,
      phone: AppConfig.USER_OBJ.phoneNumber,
    },
  });
  const [user, setUser] = useState(AppConfig.USER_OBJ);

  const [userVehicles, setUserVehicles] = useState([]);
  const { setLoading } = useLoading();

  // Mock data xe của người dùng
  const userVehicles1 = [
    {
      id: 1,
      brand: "Toyota",
      model: "Camry",
      licensePlate: "30A-12345",
      year: "2022",
      color: "Trắng",
    },
    {
      id: 2,
      brand: "Honda",
      model: "CRV",
      licensePlate: "51B-67890",
      year: "2021",
      color: "Đen",
    },
  ];

  const getVehicle = () => {
    setLoading(true);
    axios
      .get(`${DOMAIN_URL}/Vehicle/customer/${AppConfig.USER_ID}`, {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        setUserVehicles(response.data);
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

  // Mock data thống kê
  const userStats = {
    totalServices: 12,
    completedServices: 8,
    totalSpent: 2500000,
    memberSince: "2023",
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          AppConfig.USER_ID = null;
          AppConfig.USER_OBJ = null;
          AppConfig.ACCESS_TOKEN = null;
          navigation.replace("LoginScreen");
        },
      },
    ]);
  };

  const onSubmit = (data) => {
    setLoading(true);
    const dataSubmit = {
      fullName: data.name,
      email: data.email,
      phoneNumber: data.phone,
      address: "",
    };

    axios
      .put(
        `${DOMAIN_URL}/Account/update-profile/${AppConfig.USER_ID}`,
        dataSubmit,
        {
          headers: {
            Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        handleGetUser();
        Alert.alert(
          "Thành công",
          "Đã cập nhật thông tin!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      })
      .catch(function (error) {
        Alert.alert(
          "Lỗi",
          "Cập nhật thất bại, vui lòng thử lại!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      })
      .finally(function () {
        setLoading(false);
      });
  };

  const handleGetUser = () => {
    axios
      .get(`${DOMAIN_URL}/Account/by-mail/${AppConfig.USER_OBJ.email}`, {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        const user = response.data;
        AppConfig.USER_ID = user.userID;
        AppConfig.USER_OBJ = user;
        setUser(user);
      })
      .catch(function (error) {
        Alert.alert(
          "Lỗi",
          "Lấy thông tin thất bại, vui lòng thử lại!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      })
      .finally(function () {});
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f8fa" }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <FontAwesome5 name="user-alt" size={38} color="#1976d2" />
            </View>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          {/* Thống kê người dùng */}
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Thống kê</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="car-cog"
                  size={24}
                  color="#1976d2"
                />
                <Text style={styles.statNumber}>{userStats.totalServices}</Text>
                <Text style={styles.statLabel}>Tổng dịch vụ</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#4CAF50"
                />
                <Text style={styles.statNumber}>
                  {userStats.completedServices}
                </Text>
                <Text style={styles.statLabel}>Đã hoàn thành</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={24}
                  color="#FF6B35"
                />
                <Text style={styles.statNumber}>
                  {(userStats.totalSpent / 1000000).toFixed(1)}M
                </Text>
                <Text style={styles.statLabel}>Tổng chi tiêu</Text>
              </View>
            </View>
          </View>

          {/* Danh sách xe */}
          <View style={styles.vehiclesCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Xe của bạn ({userVehicles.length})
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Trang chủ", { screen: "VehiclesScreen" })
                }
              >
                <Text style={styles.seeAllText}>Quản lý</Text>
              </TouchableOpacity>
            </View>
            {userVehicles.map((vehicle, index) => (
              <View
                key={vehicle.vehicleId}
                style={[
                  styles.vehicleItem,
                  index === userVehicles.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.vehicleIcon}>
                  <MaterialCommunityIcons
                    name="car"
                    size={20}
                    color="#1976d2"
                  />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>
                    {vehicle.brand} {vehicle.model}
                  </Text>
                  <Text style={styles.vehicleDetails}>
                    {vehicle.licensePlate} • {vehicle.make} • {vehicle.year}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Form chỉnh sửa thông tin */}
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
            <FormProvider {...methods}>
              <InputForm
                name="name"
                placeholder="Họ và tên"
                messageValidate="Vui lòng nhập họ và tên!"
                prevIcon={
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#1976d2"
                    style={styles.inputIcon}
                  />
                }
              />
              <InputForm
                name="email"
                placeholder="Email"
                messageValidate="Vui lòng nhập email!"
                validate={(value) =>
                  emailRegex.test(value) || "Email không hợp lệ!"
                }
                prevIcon={
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#1976d2"
                    style={styles.inputIcon}
                  />
                }
              />
              <InputForm
                name="phone"
                placeholder="Số điện thoại"
                messageValidate="Vui lòng nhập số điện thoại!"
                validate={(value) =>
                  phoneRegex.test(value) || "Số điện thoại không hợp lệ!"
                }
                prevIcon={
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color="#1976d2"
                    style={styles.inputIcon}
                  />
                }
              />
            </FormProvider>
            <TouchableOpacity
              style={styles.button}
              onPress={methods.handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f8fa", paddingTop: 38 },
  avatarWrap: { alignItems: "center", marginBottom: 20, paddingHorizontal: 16 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e3f2fd",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  name: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 2 },
  email: { fontSize: 14, color: "#666", marginBottom: 2 },
  formCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#222",
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#1976d2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  logoutBtn: {
    backgroundColor: "#ff4d4f",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // New styles for additional sections
  statsCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  vehiclesCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  vehicleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: "#666",
  },
});

export default ProfileScreen;
