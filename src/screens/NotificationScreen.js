import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { DOMAIN_URL } from "../utils/Constant";
import AppConfig from "../utils/AppConfig";
import axios from "axios";
import { Loading } from "../components/Loading";
import { useLoading } from "../components/LoadingContext";
import { useFocusEffect } from "@react-navigation/native";
import { formatDateAndHour } from "../utils/Utils";

const getIconAndColor = (type) => {
  switch (type) {
    case "Reminder":
      return {
        icon: (
          <View style={[styles.iconCircle, { backgroundColor: "#e3f2fd" }]}>
            <Icon name="bell" size={22} color="#1976d2" />
          </View>
        ),
        color: "#1976d2",
      };
    case "System":
      return {
        icon: (
          <View style={[styles.iconCircle, { backgroundColor: "#c6cacdff" }]}>
            <Icon name="settings" size={22} color="#000000ff" />
          </View>
        ),
        color: "",
      };
    case "Promotion":
      return {
        icon: (
          <View style={[styles.iconCircle, { backgroundColor: "#fde7f3" }]}>
            <Icon name="gift" size={22} color="#e91e63" />
          </View>
        ),
        color: "#e91e63",
      };

    default:
      return {
        icon: (
          <View style={[styles.iconCircle, { backgroundColor: "#f0f0f0" }]}>
            <Icon name="info" size={22} color="#888" />
          </View>
        ),
        color: "",
      };
  }
};

const NotificationScreen = () => {
  const [notifi, setNotifi] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { setLoading } = useLoading();

  useFocusEffect(
    useCallback(() => {
      getNotification();
      return () => {};
    }, [])
  );

  const getNotification = () => {
    setLoading(true);
    axios
      .get(`${DOMAIN_URL}/Notification/user/${AppConfig.USER_ID}`, {
        headers: {
          Authorization: `Bearer ${AppConfig.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        setNotifi(response.data);
        setRefreshing(false);
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
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getNotification();
  };

  const renderItem = ({ item }) => (
    <View key={item.notificationId} style={styles.card}>
      <View style={styles.cardHeader}>
        {getIconAndColor(item.type).icon}
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.titleText,
              { color: getIconAndColor(item.type).color },
            ]}
          >
            {item.title}
          </Text>
          <Text style={styles.content}>{item.message}</Text>
          <View style={styles.dateCont}>
            <Text style={styles.date}>{formatDateAndHour(item.sentAt)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={{ padding: 16, flex: 1, paddingTop: 0, paddingBottom: 0 }}>
        <Text style={styles.title}>Thông báo</Text>
        <FlatList
          data={notifi}
          keyExtractor={(item) => item.notificationId.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24, marginTop: 18 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6fb" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#1976d2",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  titleText: { fontWeight: "bold", fontSize: 17, marginBottom: 2 },
  content: { fontSize: 15, color: "#222", marginBottom: 0 },
  date: {
    color: "#888",
    fontSize: 13,
    // marginLeft: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#22336b",
    marginTop: 24,
    marginBottom: 0,
    textAlign: "left",
  },
  dateCont: {
    alignSelf: "flex-end",
  },
});

export default NotificationScreen;
