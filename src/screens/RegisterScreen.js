import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useForm, Controller, FormProvider } from "react-hook-form";
import InputForm from "../components/InputForm";
import { emailRegex, phoneRegex } from "../utils/validator";
import axios from "axios";
import { DOMAIN_URL } from "../utils/Constant";
import { Loading } from "../components/Loading";

const RegisterScreen = ({ navigation }) => {
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (data?.password != data?.passwordConfirm) {
      methods.setError("password", {
        message: "Mật khẩu không trùng khớp!",
      });
      methods.setError("passwordConfirm", {
        message: "Mật khẩu không trùng khớp!",
      });
    }
    // setLoading(true);
    const dataSubmit = {
      fullName: data?.name,
      email: data?.email,
      phoneNumber: data?.phone,
      password: data.password,
      address: "",
    };

    axios
      .post(`${DOMAIN_URL}/Home/Signup`, dataSubmit)
      .then(function (response) {
        Alert.alert(
          "Thành Công",
          "Đã đăng ký thành công!",
          [{ text: "OK", onPress: () => navigation.navigate("LoginScreen") }],
          { cancelable: false }
        );
      })
      .catch(function (error) {
        console.log("error ", error.response.status);
        if (error.response.status == 400) {
          return Alert.alert(
            "Lỗi",
            "Email đã tồn tại!",
            [{ text: "OK", onPress: () => {} }],
            { cancelable: false }
          );
        }

        Alert.alert(
          "Lỗi",
          "Đã xảy ra lỗi, vui lòng thử lại!",
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      })
      .finally(function () {
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f4f6fb" }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
    >
      <FormProvider {...methods}>
        <View style={styles.container}>
          <Text style={styles.title}>Đăng ký</Text>
          <InputForm
            name="name"
            placeholder="Họ và tên"
            messageValidate="Vui lòng nhập họ và tên!"
          />
          <InputForm
            name="email"
            placeholder="Email"
            messageValidate="Vui lòng nhập email!"
            validate={(value) =>
              emailRegex.test(value) || "Email không hợp lệ!"
            }
          />
          <InputForm
            name="phone"
            placeholder="Số điện thoại"
            messageValidate="Vui lòng nhập số điện thoại!"
            validate={(value) =>
              phoneRegex.test(value) || "Số điện thoại không hợp lệ!"
            }
          />
          <InputForm
            name="password"
            placeholder="Mật khẩu"
            messageValidate="Vui lòng nhập mật khẩu!"
            secureTextEntry={true}
          />
          <InputForm
            name="passwordConfirm"
            placeholder="Xác nhận mật khẩu"
            messageValidate="Vui lòng xác nhận mật khẩu!"
            secureTextEntry={true}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={methods.handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </FormProvider>
      <Loading show={loading} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f4f6fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "#f8f9fa",
    // borderRadius: 14,
    // borderWidth: 1,
    // borderColor: "#e0e0e0",
    // marginTop: 16,
    // paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    fontSize: 16,
    color: "#222",
  },
  button: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#28a745",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  link: {
    color: "#007bff",
    marginTop: 8,
    fontSize: 15,
  },
});

export default RegisterScreen;
