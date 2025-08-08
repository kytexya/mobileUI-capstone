import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import BookingScreen from '../screens/BookingScreen';
import HistoryScreen from '../screens/HistoryScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentDetailScreen from '../screens/PaymentDetailScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import ActivityScreen from '../screens/ActivityScreen';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackNav = createStackNavigator();
const HomeStack = () => (
  <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
    <HomeStackNav.Screen name="HomeScreen" component={HomeScreen} />
    <HomeStackNav.Screen name="BookingScreen" component={BookingScreen} />
    <HomeStackNav.Screen name="VehiclesScreen" component={VehiclesScreen} />
    <HomeStackNav.Screen name="HistoryScreen" component={HistoryScreen} />
    <HomeStackNav.Screen name="PaymentScreen" component={PaymentScreen} />
    <HomeStackNav.Screen name="PaymentDetailScreen" component={PaymentDetailScreen} />
    <HomeStackNav.Screen name="ChatbotScreen" component={ChatbotScreen} />
  </HomeStackNav.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Trang chủ"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Trang chủ') {
          return <Ionicons name="home-outline" size={size} color={color} />;
        } else if (route.name === 'Hoạt động') {
          return <MaterialCommunityIcons name="progress-clock" size={size} color={color} />;
        } else if (route.name === 'Thông báo') {
          return <Ionicons name="notifications-outline" size={size} color={color} />;
        } else if (route.name === 'Tài khoản') {
          return <FontAwesome5 name="user-circle" size={size} color={color} />;
        }
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Trang chủ" component={HomeStack} />
    <Tab.Screen name="Hoạt động" component={ActivityScreen} />
    <Tab.Screen name="Thông báo" component={NotificationScreen} />
    <Tab.Screen name="Tài khoản" component={ProfileScreen} />
  </Tab.Navigator>
);

const CustomHeader = ({ options }) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ backgroundColor: '#f6f8fa', paddingTop: insets.top }}>
      <Text style={{
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a237e',
        textAlign: 'center',
        paddingVertical: 12,
      }}>{options.title}</Text>
    </SafeAreaView>
  );
};

const defaultHeaderOptions = {
  headerTitleAlign: 'center',
  header: (props) => <CustomHeader {...props} />,
  headerStyle: {
    backgroundColor: '#f6f8fa',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
};

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="LoginScreen">
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: 'Đăng ký', ...defaultHeaderOptions }} />
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    {/* Nếu có các màn chi tiết, thêm ở đây */}
    {/* <Stack.Screen name="ChatbotScreen" component={ChatbotScreen} options={{ title: 'Chatbot hỗ trợ', ...defaultHeaderOptions }} /> */}
  </Stack.Navigator>
);

export default AppNavigator; 