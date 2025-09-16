import React, { useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { DOMAIN_URL } from "../utils/Constant";
import axios from "axios";
import AppConfig from "../utils/AppConfig";

export default function WebViewPaymentScreen({ route, navigation }) {
  const { paymentUrl } = route.params;

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={(event) => {
        // console.log("event ",event.url);
        // axios
        //       .get(`${event.url}`)
        //       .then(function (response) {
        //         console.log("vnpay/payment-execute ", response);
        //         // Alert.alert(
        //         //   "Thanh toán thành công!",
        //         //   "Cảm ơn bạn đã thanh toán online!",
        //         //   [
        //         //     {
        //         //       text: "OK",
        //         //       onPress: () =>
        //         //         navigation.reset({
        //         //           index: 0,
        //         //           routes: [
        //         //             {
        //         //               name: "Trang chủ",
        //         //               state: {
        //         //                 routes: [{ name: "HomeScreen" }],
        //         //               },
        //         //             },
        //         //           ],
        //         //         }),
        //         //     },
        //         //   ]
        //         // );
        //       })
        //       .catch(function (error) {
        //         Alert.alert(
        //           "Lỗi",
        //           "Đã xảy ra lỗi, vui lòng thử lại!",
        //           [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        //           { cancelable: false }
        //         );
        //       })
        //       .finally(function () {});

        if (event.url.includes("/payment-execute")) {
          const urlParams = new URLSearchParams(event.url.split("?")[1]);
          const responseCode = urlParams.get("vnp_ResponseCode"); // "00" = success
          const orderId = urlParams.get("vnp_TxnRef");

          if (responseCode === "00") {
            // navigation.replace("PaymentResult", { success: true, orderId });
            axios
              .get(`${event.url}`)
              .then(function (response) {
                console.log("vnpay/payment-execute ", response);
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
                  Alert.alert(
                    "Thanh toán thành công!",
                    "Cảm ơn bạn đã thanh toán online!",
                    [
                      {
                        text: "OK",
                        onPress: () => {},
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
              .finally(function () {});
          } else {
            // navigation.replace("PaymentResult", { success: false, orderId });
            Alert.alert("Thanh toán thất bại!", "Vui lòng thử lại!", [
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
            ]);
          }
        }
      }}
    />
  );
}
