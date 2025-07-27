import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const mockOngoing = [
  { id: '1', service: 'Bảo dưỡng', status: 'Đang chờ xác nhận', progress: 20, icon: 'car-cog', date: '2024-06-01' },
  { id: '2', service: 'Rửa xe', status: 'Đang thực hiện', progress: 60, icon: 'car-wash', date: '2024-06-02' },
];
const mockHistory = [
  { id: '3', service: 'Sửa chữa', status: 'Hoàn thành', progress: 100, icon: 'wrench', date: '2024-05-28' },
];

const getStatusColor = (status) => {
  if (status === 'Hoàn thành') return '#27ae60';
  if (status === 'Đang thực hiện') return '#ff9800';
  return '#1976d2';
};

const ActivityScreen = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const data = activeTab === 'ongoing' ? mockOngoing : mockHistory;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoạt động</Text>
      <View style={styles.tabRow}>
        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('ongoing')}>
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.tabTextActive]}>Đang diễn ra</Text>
          {activeTab === 'ongoing' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('history')}>
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>Lịch sử</Text>
          {activeTab === 'history' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24, marginTop: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <MaterialCommunityIcons name={item.icon} size={28} color={getStatusColor(item.status)} style={{ marginRight: 14 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.service}>{item.service}</Text>
                <Text style={styles.date}>Ngày: <Text style={styles.dateBold}>{item.date}</Text></Text>
                <View style={styles.progressBarWrap}>
                  <View style={[styles.progressBar, { width: `${item.progress}%`, backgroundColor: getStatusColor(item.status) }]} />
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '22' }]}> 
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f6fb' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 24, marginBottom: 8, textAlign: 'left', color: '#22336b' },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
    marginTop: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#e0f2f1',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 6,
  },
  tabText: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#009ca6',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: '#1de9b6',
    borderRadius: 2,
    marginTop: 4,
    width: 60,
    alignSelf: 'center',
  },
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
  date: { fontSize: 13, color: '#888', marginBottom: 1 },
  dateBold: { color: '#222', fontWeight: '500' },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  statusText: { fontWeight: 'bold', fontSize: 13 },
  progressBarWrap: {
    height: 7,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 2,
    width: 120,
    overflow: 'hidden',
  },
  progressBar: {
    height: 7,
    borderRadius: 6,
  },
});

export default ActivityScreen; 