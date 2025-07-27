import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const mockHistory = [
  { id: '1', service: 'Bảo dưỡng', date: '2024-05-01', vehicle: 'Toyota Camry', status: 'Hoàn thành' },
  { id: '2', service: 'Sửa chữa', date: '2024-04-15', vehicle: 'Honda CRV', status: 'Đang xử lý' },
];

const getServiceIcon = (service) => {
  if (service === 'Sửa chữa') return <MaterialCommunityIcons name="wrench" size={28} color="#1976d2" style={{ marginRight: 14 }} />;
  return <MaterialCommunityIcons name="car-cog" size={28} color="#1976d2" style={{ marginRight: 14 }} />;
};

const getStatusStyle = (status) => {
  if (status === 'Hoàn thành') return [styles.statusBadge, { backgroundColor: '#e6f7ec' }];
  return [styles.statusBadge, { backgroundColor: '#fff4e6' }];
};
const getStatusTextColor = (status) => (status === 'Hoàn thành' ? '#27ae60' : '#ff9800');

const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử dịch vụ</Text>
      <FlatList
        data={mockHistory}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              {getServiceIcon(item.service)}
              <View style={{ flex: 1 }}>
                <Text style={styles.service}>{item.service}</Text>
                <Text style={styles.info}>Xe: <Text style={styles.infoBold}>{item.vehicle}</Text></Text>
                <Text style={styles.info}>Ngày: <Text style={styles.infoBold}>{item.date}</Text></Text>
              </View>
              <View style={getStatusStyle(item.status)}>
                <Text style={[styles.statusText, { color: getStatusTextColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f6fb' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 18, textAlign: 'left', color: '#22336b', marginTop: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 18,
    marginBottom: 16,
    shadowColor: 'transparent',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  service: { fontWeight: '600', fontSize: 17, color: '#22336b', marginBottom: 2 },
  info: { fontSize: 13, color: '#888', marginBottom: 1 },
  infoBold: { color: '#222', fontWeight: '500' },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  statusText: { fontWeight: 'bold', fontSize: 13 },
});

export default HistoryScreen; 