import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView as RNScrollView } from 'react-native';

const carImage = require('../assets/banner.png');

// Mock data khuyến mãi
const promotions = [
  { id: '1', title: 'Giảm 20% dịch vụ rửa xe', desc: 'Áp dụng đến 30/6', image: require('../assets/banner.png'), label: 'GIẢM 20%' },
  { id: '2', title: 'Tặng voucher 50k', desc: 'Khi đặt lịch bảo dưỡng', image: require('../assets/banner.png'), label: 'VOUCHER 50K' },
  { id: '3', title: 'Miễn phí kiểm tra lốp', desc: '', image: require('../assets/banner.png'), label: 'MIỄN PHÍ' },
];
// Mock data trạng thái dịch vụ
const serviceStatus = [
  { id: 'a1', name: 'Thay dầu', status: 'Đang chờ xác nhận', icon: <MaterialCommunityIcons name="oil" size={24} color="#1976d2" />, progress: 30 },
  { id: 'a2', name: 'Rửa xe', status: 'Đang thực hiện', icon: <MaterialCommunityIcons name="car-wash" size={24} color="#43a047" />, progress: 60 },
];

const mainFeatures = [
  {
    key: 'booking',
    label: 'Đặt lịch',
    icon: <MaterialCommunityIcons name="calendar-clock" size={36} color="#1976d2" />,
    screen: 'BookingScreen',
  },
  {
    key: 'vehicles',
    label: 'Quản lý xe',
    icon: <MaterialCommunityIcons name="car" size={32} color="#43a047" />,
    screen: 'VehiclesScreen',
  },
  {
    key: 'chatbot',
    label: 'Chatbot',
    icon: <MaterialCommunityIcons name="robot-outline" size={36} color="#0288d1" />,
    screen: 'ChatbotScreen',
  },
  {
    key: 'payment',
    label: 'Thanh toán',
    icon: <MaterialCommunityIcons name="credit-card" size={32} color="#fbc02d" />,
    screen: 'PaymentScreen',
  },
];

// Mock data banner quảng cáo lớn
const bigAds = [
  {
    id: 'b1',
    image: require('../assets/banner.png'),
    title: 'Combo bảo dưỡng toàn diện',
    desc: 'Tiết kiệm 25% khi đặt combo bảo dưỡng định kỳ và thay dầu động cơ!',
  },
  {
    id: 'b2',
    image: require('../assets/banner.png'),
    title: 'Đặt lịch rửa xe - Nhận quà liền tay',
    desc: 'Tặng ngay khăn lau xe cao cấp cho 100 khách hàng đầu tiên đặt lịch rửa xe online.',
  },
  {
    id: 'b3',
    image: require('../assets/banner.png'),
    title: 'Ưu đãi kiểm tra lốp miễn phí',
    desc: 'Đặt lịch kiểm tra lốp xe miễn phí, an tâm trên mọi hành trình!',
  },
];

// Mock data banner lớn giữa
const middleBanner = {
  bgColor: '#1ec6b6',
  title: 'Để xe luôn sẵn sàng',
  desc: 'Gói hội viên bảo dưỡng định kỳ, ưu đãi tới 20% cho khách hàng mới!',
  label: 'Ưu đãi hội viên',
  image: require('../assets/banner.png'), // Thay bằng ảnh phù hợp nếu có
};

// Mock data banner nhỏ giữa
const smallBanner = {
  bgColor: '#fbc02d',
  title: 'Đặt lịch bảo dưỡng dễ dàng',
  desc: 'Chỉ với 3 bước đơn giản, xe bạn sẽ được chăm sóc tận nơi!',
};

// Hàm lấy màu theo phần trăm tiến trình
const getProgressColor = (percent) => {
  if (percent < 40) return '#ff7043'; // đỏ/cam nhạt
  if (percent < 80) return '#ffb300'; // vàng/cam
  return '#1976d2'; // xanh dương
};

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f6f8fa' }} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* DASHBOARD */}
      <View style={styles.dashboardWrap}>
        {/* Chào mừng user */}
        <Text style={styles.welcomeText}>Xin chào, Bao 👋</Text>
        {/* Trạng thái dịch vụ đang đặt */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Dịch vụ đang đặt</Text>
          {serviceStatus.map(s => (
            <View key={s.id} style={styles.statusRow}>
              <View style={styles.statusIcon}>{s.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statusService}>{s.name}</Text>
                <Text style={styles.statusState}>{s.status}</Text>
                {/* Progress bar */}
                <View style={styles.progressBarWrap}>
                  <View style={[styles.progressBar, { width: `${s.progress}%`, backgroundColor: getProgressColor(s.progress) }]} />
                </View>
                <Text style={styles.progressText}>{s.progress}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      {/* Thanh tính năng chính dạng ô vuông bo tròn */}
      <View style={styles.mainFeatureRow}>
        {mainFeatures.map(f => (
          <TouchableOpacity
            key={f.key}
            style={styles.mainFeatureBox}
            onPress={() => navigation.navigate(f.screen)}
            activeOpacity={0.8}
          >
            <View style={styles.mainFeatureIcon}>{f.icon}</View>
            <Text style={styles.mainFeatureLabel}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Banner lớn giữa, style nổi bật (đặt dưới 4 ô chức năng) */}
      <View style={[styles.middleBanner, { backgroundColor: middleBanner.bgColor }]}> 
        <View style={{ flex: 1 }}>
          <Text style={styles.middleBannerTitle}>{middleBanner.title}</Text>
          <Text style={styles.middleBannerDesc}>{middleBanner.desc}</Text>
          <View style={styles.middleBannerLabel}><Text style={styles.middleBannerLabelText}>{middleBanner.label}</Text></View>
        </View>
        <Image source={middleBanner.image} style={styles.middleBannerImg} resizeMode="contain" />
      </View>
      {/* Banner quảng cáo lớn bên dưới 4 ô chức năng */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.bigAdSlider, { marginTop: 16 }]}
      >
        {bigAds.map(item => (
          <View key={item.id} style={styles.bigAdCard}>
            <Image source={item.image} style={styles.bigAdImg} resizeMode="cover" />
            <Text style={styles.bigAdTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.bigAdDesc} numberOfLines={3}>{item.desc}</Text>
          </View>
        ))}
      </ScrollView>
      {/* Banner nhỏ giữa, style nổi bật */}
      <View style={styles.smallBanner}>
        <Text style={styles.smallBannerTitle}>{smallBanner.title}</Text>
        <Text style={styles.smallBannerDesc}>{smallBanner.desc}</Text>
      </View>
      {/* Khuyến mãi nổi bật (đưa xuống dưới cùng) */}
      <View style={{ marginTop: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={styles.sectionTitle}>Khuyến mãi nổi bật</Text>
          <TouchableOpacity><Text style={styles.seeMore}>Xem thêm</Text></TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoCardSlider}
        >
          {promotions.map(item => (
            <View key={item.id} style={styles.promoCardBox}>
              <Image source={item.image} style={styles.promoCardImg} resizeMode="cover" />
              <Text style={styles.promoCardTitle}>{item.title}</Text>
              {!!item.label && <View style={styles.promoCardLabel}><Text style={styles.promoCardLabelText}>{item.label}</Text></View>}
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const HERO_HEIGHT = 140;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6f8fa' },
  header: {
    paddingTop: 36,
    paddingBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', fontFamily: 'Inter_700Bold' },
  carImage: {
    width: width - 32,
    height: 120,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    objectFit: 'cover',
  },
  container: { padding: 16, paddingBottom: 40 },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  welcomeText: { fontSize: 19, fontWeight: 'bold', color: '#222', fontFamily: 'Inter_700Bold' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  cardPrimary: {
    backgroundColor: '#1976d2',
    elevation: 3,
    shadowColor: '#1976d2',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIcon: { marginRight: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', fontFamily: 'Inter_500Medium' },
  cardDesc: { fontSize: 13, color: '#555', marginTop: 2, fontFamily: 'Inter_400Regular' },
  profileBtn: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    elevation: 2,
  },
  profileBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  heroCardCustom: {
    width: width - 32,
    height: HERO_HEIGHT + 60,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  heroBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: HERO_HEIGHT,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  logoCircleWrapper: {
    position: 'absolute',
    top: HERO_HEIGHT - 40,
    left: (width - 32) / 2 - 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#ffe082',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#ffe082',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  brandName: {
    marginTop: 48,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    letterSpacing: 1,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 80, // đẩy FAB lên trên footer
    backgroundColor: '#ff9800',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 16, // tăng elevation
    shadowColor: '#ff9800',
    shadowOpacity: 0.35, // tăng shadow
    shadowRadius: 24, // tăng shadow
    shadowOffset: { width: 0, height: 12 }, // tăng shadow
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    zIndex: 1,
  },
  footerText: {
    color: '#888',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  featuredScroll: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 70,
  },
  featuredIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#f4f6fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#e3eaf2',
    elevation: 1,
  },
  featuredLabel: {
    fontSize: 13,
    color: '#222',
    textAlign: 'center',
    fontWeight: '500',
  },
  mainFeatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 10,
    marginTop: -10,
  },
  mainFeatureBox: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    backgroundColor: '#f4f6fb', // xám nhạt
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  mainFeatureIcon: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainFeatureLabel: {
    color: '#222',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },
  dashboardWrap: {
    marginHorizontal: 16,
    marginTop: 38, // đẩy xuống dưới hơn
    marginBottom: 18,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 14,
    marginLeft: 2,
    paddingTop: 6,
  },
  promoSlider: {
    paddingBottom: 8,
    paddingTop: 2,
  },
  promoCard: {
    width: 220,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'column',
  },
  promoImg: {
    width: '100%',
    height: 54,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  promoInfoBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
    justifyContent: 'center',
  },
  promoTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#1976d2',
    marginBottom: 2,
  },
  promoDesc: {
    fontSize: 13,
    color: '#555',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 14,
    padding: 14,
    elevation: 1,
    shadowColor: '#1976d2',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  statusTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statusService: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1976d2',
  },
  statusState: {
    fontSize: 12,
    color: '#555',
  },
  progressBarWrap: {
    height: 6,
    backgroundColor: '#e3eaff',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 2,
    overflow: 'hidden',
    width: '98%',
    alignSelf: 'center',
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1976d2',
    borderRadius: 12,
  },
  progressText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 0,
    fontFamily: 'Inter_500Medium',
    alignSelf: 'flex-end',
    marginRight: 2,
    opacity: 0.85,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  seeMore: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bannerSlider: {
    paddingBottom: 8,
  },
  bannerCard: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 8,
  },
  bannerImg: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bannerTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#1976d2',
    marginTop: 8,
    marginHorizontal: 12,
  },
  bannerDesc: {
    fontSize: 13,
    color: '#555',
    marginHorizontal: 12,
    marginBottom: 10,
  },
  bigAdSlider: {
    marginTop: 10,
    paddingLeft: 8,
    paddingBottom: 8,
  },
  bigAdCard: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 8,
    minHeight: 140,
    maxHeight: 180,
    justifyContent: 'flex-start',
    paddingBottom: 14,
    paddingTop: 0,
  },
  bigAdImg: {
    width: '100%',
    height: 70,
    // Không bo góc ảnh, chỉ card bo tròn 4 góc
  },
  bigAdTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1976d2',
    marginTop: 10,
    marginHorizontal: 12,
    marginBottom: 2,
    textAlign: 'left',
    flexShrink: 1,
    lineHeight: 18,
  },
  bigAdDesc: {
    fontSize: 12,
    color: '#555',
    marginHorizontal: 12,
    marginBottom: 8,
    textAlign: 'left',
    lineHeight: 16,
    flexShrink: 1,
    marginTop: 0,
    fontWeight: '400',
  },
  promoCardSlider: {
    paddingBottom: 8,
    paddingLeft: 4,
  },
  promoCardBox: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 4,
  },
  promoCardImg: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  promoCardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1976d2',
    marginTop: 8,
    marginHorizontal: 8,
    textAlign: 'center',
  },
  promoCardLabel: {
    marginTop: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  promoCardLabelText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 12,
  },
  middleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    marginHorizontal: 8,
    marginTop: 18,
    marginBottom: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    minHeight: 100,
    elevation: 2,
    shadowColor: '#1ec6b6',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  middleBannerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 6,
  },
  middleBannerDesc: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 10,
  },
  middleBannerLabel: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 2,
  },
  middleBannerLabelText: {
    color: '#1ec6b6',
    fontWeight: 'bold',
    fontSize: 13,
  },
  middleBannerImg: {
    width: 80,
    height: 80,
    marginLeft: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  smallBanner: {
    backgroundColor: '#fbc02d',
    borderRadius: 18,
    marginHorizontal: 8,
    marginTop: 18,
    marginBottom: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    elevation: 1,
    shadowColor: '#fbc02d',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'flex-start',
  },
  smallBannerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 6,
  },
  smallBannerDesc: {
    color: '#fff',
    fontSize: 14,
  },
});

export default HomeScreen; 