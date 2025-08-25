import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { useForm, Controller, useFormContext } from "react-hook-form";

export default function InputForm(props) {
  const {
    name = "",
    messageValidate = "Vui lòng nhập thông tin!",
    placeholder = "",
    validate = () => {},
    secureTextEntry = false,
    prevIcon
  } = props;

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: messageValidate,
        validate: (value) => validate(value)
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.container}>
          <View
            style={[styles.inputContainer, errors?.[name] && styles.errorField]}
          >
            {prevIcon && prevIcon}
            <TextInput
              style={[styles.input]}
              placeholder={placeholder}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholderTextColor="#aaa"
              secureTextEntry={secureTextEntry}
            />
          </View>
          {errors?.[name] && (
            <Text style={styles.inputError}>{errors?.[name]?.message}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
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
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    paddingLeft: 16,
    paddingRight: 16,
    // backgroundColor: "#f8f9fa",
    // borderRadius: 14,
    // borderWidth: 1,
    // borderColor: "#e0e0e0",
    // marginTop: 16,
    // paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 16,    
    marginBottom: 0,
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
    errorField: {
    borderWidth: 1,
    borderColor: "#ff0000ff",
  },

  inputError: {
    color: "#ff0000ff",
  },
});
