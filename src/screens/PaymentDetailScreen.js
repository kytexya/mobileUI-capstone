import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { formatVND } from "../utils/Utils";
import { Loading } from "../components/Loading";
import axios from "axios";
import { DOMAIN_URL } from "../utils/Constant";
import AppConfig from "../utils/AppConfig";
import { useNavigation } from "@react-navigation/native";
import { useLoading } from "../components/LoadingContext";

const PaymentDetailScreen = ({ route, navigation }) => {
  const { selectedBill, selectedMethod } = route.params;

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const { setLoading } = useLoading();

  const qrImages = {
    zalopay: require("../assets/banner.png"),
    vnpay: require("../assets/banner.png"),
  };

  const handleConfirmPayment = () => {
    console.log("selectedBill ",selectedBill);
    
    if (selectedMethod === "cash") {
      setLoading(true);
      const nowISO = new Date().toISOString();
      const dataSubmit = {
        appointmentId: selectedBill.appointmentId,
        amount: selectedBill.price ?? 0,
        paymentMethod: selectedMethod === "cash" ? "Cash" : "Credit Card",
        paidAt: nowISO,
        orderId: selectedBill.orderId,
        status: "Pending",
      };

      axios
        .post(`${DOMAIN_URL}/Payment/create`, dataSubmit, {
          headers: {
            Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          Alert.alert(
            "Thanh toán thành công!",
            "Cảm ơn bạn đã thanh toán online!",
            [
              {
                text: "OK",
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: "Trang chủ",
                        state: {
                          routes: [{ name: "HomeScreen" }],
                        },
                      },
                    ],
                  }),
              },
            ]
          );
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
    } else {
      const dataSubmit = {
        amount: selectedBill.price,
        orderId: selectedBill.orderId,
      };

      axios
        .post(`${DOMAIN_URL}/Payment/payment/vnpay/payment-url`, dataSubmit, {
          headers: {
            Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          navigation.navigate("Trang chủ", {
            screen: "WebViewPaymentScreen",
            params: {
              paymentUrl: response.data,
            },
          });
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
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <View style={styles.container} >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Thông tin thanh toán</Text>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name="car-cog" size={24} color="#007bff" />
            <Text style={styles.summaryText}>Dịch vụ: {selectedBill.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons
              name="currency-usd"
              size={24}
              color="#28a745"
            />
            <Text style={styles.amountText}>{formatVND(selectedBill.price)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.methodCard}>
          <Text style={styles.methodTitle}>Phương thức thanh toán</Text>
          <View style={styles.methodInfo}>
            <MaterialCommunityIcons
              name={
                selectedMethod === "bank"
                  ? "credit-card"
                  : selectedMethod === "cash"
                  ? "cash"
                  : "qrcode-scan"
              }
              size={28}
              color="#007bff"
            />
            <Text style={styles.methodText}>
              {selectedMethod === "bank"
                ? "Thẻ ngân hàng"
                : selectedMethod === "cash"
                ? "Tiền mặt"
                : selectedMethod === "zalopay"
                ? "ZaloPay"
                : "VNPay"}
            </Text>
          </View>
        </View>

        {/* Payment Form */}
        {selectedMethod === "bank" ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Thông tin thẻ</Text>

            <View style={styles.inputGroup}>
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={22}
                color="#007bff"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Số thẻ"
                keyboardType="number-pad"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                maxLength={19}
                placeholderTextColor="#b0b8c1"
              />
            </View>

            <View style={styles.inputGroup}>
              <MaterialCommunityIcons
                name="account"
                size={22}
                color="#007bff"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Tên chủ thẻ"
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="characters"
                placeholderTextColor="#b0b8c1"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#007bff"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChangeText={(text) => setCardExpiry(formatExpiry(text))}
                  maxLength={5}
                  placeholderTextColor="#b0b8c1"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <MaterialCommunityIcons
                  name="lock"
                  size={20}
                  color="#007bff"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
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
        ) : selectedMethod === "cash" ? (
          <View style={styles.cashCard}>
            <Text style={styles.formTitle}>Thanh toán tiền mặt</Text>

            <View style={styles.cashInfo}>
              <MaterialCommunityIcons name="cash" size={48} color="#4caf50" />
              <Text style={styles.cashTitle}>Thanh toán khi nhận xe</Text>
              <Text style={styles.cashDescription}>
                Bạn sẽ thanh toán {formatVND(selectedBill.price)} bằng tiền mặt
                khi đến nhận xe tại garage
              </Text>
            </View>

            <View style={styles.cashDetails}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color="#666"
                />
                <Text style={styles.detailText}>
                  Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#666"
                />
                <Text style={styles.detailText}>
                  Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Chủ nhật)
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="phone" size={20} color="#666" />
                <Text style={styles.detailText}>Liên hệ: 0909 123 456</Text>
              </View>
            </View>
          </View>
        ) : (
          // <View style={styles.qrCard}>
          //   <Text style={styles.formTitle}>Quét mã QR để thanh toán</Text>
          //   <View style={styles.qrContainer}>
          //     <Image
          //       source={qrImages[selectedMethod]}
          //       style={styles.qrImage}
          //       resizeMode="contain"
          //     />
          //   </View>
          //   <Text style={styles.qrNote}>
          //     Mở ứng dụng {selectedMethod === "zalopay" ? "ZaloPay" : "VNPay"} và
          //     quét mã QR
          //   </Text>
          // </View>
          <View style={{flex: 1}}/>
        )}
      </ScrollView>

      {/* Security Note */}
      <View style={styles.securityCard}>
        <MaterialCommunityIcons name="shield-check" size={20} color="#28a745" />
        <Text style={styles.securityText}>
          Thông tin thanh toán được mã hóa và bảo mật
        </Text>
      </View>

      {/* Payment Button */}
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={handleConfirmPayment}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#34d399", "#10b981"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <MaterialCommunityIcons
            name={
              selectedMethod === "cash" ? "check-circle" : "credit-card-check"
            }
            size={24}
            color="#fff"
          />
          <Text style={styles.paymentButtonText}>
            {selectedMethod === "cash"
              ? "Xác nhận đặt lịch"
              : "Xác nhận thanh toán"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
  },
  summaryCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#007bff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
    marginLeft: 12,
  },
  methodCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#007bff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  methodInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodText: {
    fontSize: 16,
    color: "#007bff",
    marginLeft: 12,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#007bff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: {
    position: "relative",
    marginBottom: 16,
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: 14,
    zIndex: 2,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 44,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    color: "#333",
  },
  row: {
    flexDirection: "row",
  },
  qrCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#007bff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    alignItems: "center",
  },
  qrContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
  },
  qrImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
  },
  qrNote: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  securityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e8",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  securityText: {
    fontSize: 14,
    color: "#28a745",
    marginLeft: 8,
  },
  paymentButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#4f8cff",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cashCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#007bff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cashInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  cashTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  cashDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  cashDetails: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
});

export default PaymentDetailScreen;
