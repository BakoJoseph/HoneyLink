import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { CHAT_LIST } from '../../scripts/graphql';
import Navigation from './navigation';

const PINK = '#E8476A';

export default function MessagesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('messages');

  const { data, loading, startPolling, stopPolling } = useQuery(CHAT_LIST, {
    variables: { limit: 30 },
  });

  useEffect(() => {
    startPolling(10000);
    return () => stopPolling();
  }, []);

  const chats: any[] = data?.chatList ?? [];

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') router.push('/homepage');
    if (tab === 'favorites') router.push('/matches');
    if (tab === 'profile') router.push('/profile');
    if (tab === 'add') router.push('/shorts');
  };

  const renderItem = ({ item }: { item: any }) => {
    const other = item.participants?.[0] ?? {};
    const photo = other.profile?.photos?.[0] || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200';
    const lastMsg = item.lastMessage?.text ?? 'No messages yet';

    return (
      <TouchableOpacity
        style={styles.convoRow}
        onPress={() => router.push({ pathname: '/chat-room', params: { chatId: item.id } })}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: photo }} style={styles.avatar} />
        </View>
        <View style={styles.convoText}>
          <View style={styles.convoTopRow}>
            <Text style={styles.convoName}>{other.username ?? 'User'}</Text>
          </View>
          <Text numberOfLines={1} style={styles.convoLastMsg}>{lastMsg}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <View style={styles.divider} />

      {loading && chats.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>DM</Text>
          </View>
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySubtitle}>
            Match with someone and start a conversation!
          </Text>
          <TouchableOpacity style={styles.swipeBtn} onPress={() => router.push('/homepage')}>
            <Text style={styles.swipeBtnText}>Find Matches</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Navigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#111111', letterSpacing: -0.5 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 20, marginBottom: 4 },
  listContent: { paddingBottom: 24 },
  convoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  avatarWrapper: { position: 'relative', marginRight: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  convoText: { flex: 1 },
  convoTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  convoName: { fontWeight: '600', fontSize: 15, color: '#111111' },
  convoLastMsg: { fontSize: 13, color: '#9CA3AF' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#FCE7EB',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  emptyIconText: { fontSize: 24, fontWeight: '700', color: PINK },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#1F2937', textAlign: 'center', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  swipeBtn: { backgroundColor: PINK, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 99 },
  swipeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
