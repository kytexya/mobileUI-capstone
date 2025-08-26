import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { emailRegex, phoneRegex } from "../utils/validator";
import AppConfig from "../utils/AppConfig";
import { DOMAIN_URL } from "../utils/Constant";
import { useState } from "react";
import { Loading } from "../components/Loading";

const LoginScreen = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      // emailOrPhone: "test4@gmail.com",
      // password: "12345",
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    const dataSubmit = {
      userName: data?.emailOrPhone,
      password: data?.password,
    };
    axios
      .post(DOMAIN_URL + "/Home/Login", dataSubmit)
      .then(function (response) {
        const token = response.data;
        AppConfig.ACCESS_TOKEN = token;
        handleGetUser(token, data?.emailOrPhone);
        navigation.replace("MainTabs");
      })
      .catch(function (error) {
        setLoading(false);
        Alert.alert(
          "Lỗi",
          "Đã xảy ra lỗi, vui lòng thử lại!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      })
      .finally(function () {});
  };

  const handleGetUser = (token, email) => {
    axios
      .get(`${DOMAIN_URL}/Account/by-mail/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        setLoading(false);
        const user = response.data;
        AppConfig.USER_ID = user.userID;
        AppConfig.USER_OBJ = user;
      })
      .catch(function (error) {
        setLoading(false);
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f4f6fb" }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
    >
      <View style={styles.outerContainer}>
        <View style={styles.card}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Đăng nhập</Text>
          <Controller
            control={control}
            name="emailOrPhone"
            rules={{
              required: "Vui lòng nhập email!",
              validate: (value) =>
                emailRegex.test(value) || "Email  không hợp lệ!",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <View
                  style={[
                    styles.inputContainer,
                    errors.emailOrPhone && styles.errorField,
                  ]}
                >
                  <Icon
                    name="user"
                    size={20}
                    color="#007bff"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập email"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                </View>
                {errors.emailOrPhone && (
                  <Text style={styles.inputError}>
                    {errors.emailOrPhone.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Vui lòng nhập mật khẩu",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <View
                  style={[
                    styles.inputContainer,
                    errors.password && styles.errorField,
                  ]}
                >
                  <Icon
                    name="lock"
                    size={20}
                    color="#007bff"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    secureTextEntry
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                </View>
                {errors.password && (
                  <Text style={styles.inputError}>
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          {/* Nút để vào ứng dụng mà không cần đăng nhập */}
          {/* <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={() => {
              // Mock user data để test
              AppConfig.ACCESS_TOKEN = "mock_token_123";
              AppConfig.USER_ID = "mock_user_123";
              AppConfig.USER_OBJ = {
                userId: "mock_user_123",
                email: "test@example.com",
                fullName: "Bao Nguyễn",
                name: "Bao Nguyễn",
                phoneNumber: "0123456789"
              };
              navigation.replace("MainTabs");
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.skipButtonText}>Vào ứng dụng (Test)</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Loading show={loading} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6fb",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#007bff",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 18,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 28,
    letterSpacing: 1,
    fontFamily: "Inter_700Bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 16,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#222",
    fontFamily: "Inter_400Regular",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#007bff",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: "Inter_500Medium",
  },
  skipButton: {
    backgroundColor: "#28a745",
    marginTop: 8,
  },
  skipButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: "Inter_500Medium",
  },
  link: {
    color: "#007bff",
    marginTop: 8,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },

  errorField: {
    borderWidth: 1,
    borderColor: "#ff0000ff",
  },

  inputError: {
    color: "#ff0000ff",
  },
});

export default LoginScreen;
