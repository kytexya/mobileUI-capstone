import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockNotifications = [
  { id: '1', type: 'reminder', title: 'Nhắc nhở bảo dưỡng', content: 'Xe Toyota Camry đến hạn bảo dưỡng.', date: '2024-06-01' },
  { id: '2', type: 'promo', title: 'Khuyến mãi', content: 'Giảm giá 20% cho dịch vụ thay dầu.', date: '2024-05-28' },
];

const getIcon = (type) => {
  if (type === 'reminder') return (
    <View style={[styles.iconCircle, { backgroundColor: '#e3f2fd' }] }>
      <Icon name="bell" size={22} color="#1976d2" />
    </View>
  );
  if (type === 'promo') return (
    <View style={[styles.iconCircle, { backgroundColor: '#fde7f3' }] }>
      <Icon name="gift" size={22} color="#e91e63" />
    </View>
  );
  return (
    <View style={[styles.iconCircle, { backgroundColor: '#f0f0f0' }] }>
      <Icon name="info" size={22} color="#888" />
    </View>
  );
};

const NotificationScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Thông báo</Text>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 24, marginTop: 18 }}
        showsVerticalScrollIndicator={false}
      >
        {mockNotifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              {getIcon(item.type)}
              <View style={{ flex: 1 }}>
                <Text style={[styles.titleText, item.type === 'promo' ? { color: '#e91e63' } : { color: '#1976d2' }]}>{item.title}</Text>
                <Text style={styles.content}>{item.content}</Text>
              </View>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f6fb' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  titleText: { fontWeight: 'bold', fontSize: 17, marginBottom: 2 },
  content: { fontSize: 15, color: '#222', marginBottom: 0 },
  date: { color: '#888', fontSize: 13, marginLeft: 12, alignSelf: 'flex-start', marginTop: 2 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#22336b', marginTop: 24, marginBottom: 0, textAlign: 'left' },
});

export default NotificationScreen; 