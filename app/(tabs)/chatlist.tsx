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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CHAT_LIST, ME_WITH_COUNTS } from '../../scripts/graphql';
import Navigation from './navigation';

const PINK = '#FF4D6D';

type ChatParticipant = {
  id: string;
  username?: string;
  profile?: {
    photos?: string[];
  };
};

type ChatListItem = {
  id: string;
  participants?: ChatParticipant[];
  lastMessage?: {
    text?: string;
    createdAt?: string;
  };
};

type ChatListData = {
  chatList: ChatListItem[];
};

type MeData = {
  me?: { id: string };
};

function formatLastTime(iso?: string): string {
  if (!iso) return '';

  const date = new Date(iso);
  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function Avatar({ uri, name }: { uri?: string; name?: string }) {
  const [failed, setFailed] = useState(false);
  const initial = (name ?? '?')[0].toUpperCase();

  if (uri && !failed) {
    return (
      <View style={styles.avatarOuter}>
        <Image source={{ uri }} style={styles.avatar} onError={() => setFailed(true)} />
      </View>
    );
  }

  return (
    <View style={[styles.avatarOuter, styles.avatarFallback]}>
      <Text style={styles.avatarInitial}>{initial}</Text>
    </View>
  );
}

export default function ChatListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: meData } = useQuery<MeData>(ME_WITH_COUNTS);
  const myId = meData?.me?.id;

  const { data, loading, startPolling, stopPolling } = useQuery<ChatListData>(CHAT_LIST, {
    variables: { limit: 30 },
  });

  useEffect(() => {
    startPolling(10000);
    return () => stopPolling();
  }, []);

  const chats = data?.chatList ?? [];

  const handleTabPress = (tab: string) => {
    if (tab === 'home') router.push('/homepage');
    if (tab === 'favorites') router.push('/matches');
    if (tab === 'profile') router.push('/profile');
    if (tab === 'add') router.push('/shorts');
  };

  const navBarHeight = 60 + Math.max(insets.bottom, 16) + 4;

  const renderItem = ({ item }: { item: ChatListItem }) => {
    const other = myId
      ? (item.participants?.find((participant) => participant.id !== myId) ?? item.participants?.[0])
      : item.participants?.[0];
    const photo = other?.profile?.photos?.[0];
    const lastMsg = item.lastMessage?.text ?? 'No messages yet';
    const lastTime = formatLastTime(item.lastMessage?.createdAt);

    return (
      <TouchableOpacity
        style={styles.convoRow}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: '/chat-room',
            params: { chatId: item.id, chatName: other?.username ?? 'Chat' },
          })
        }>
        <Avatar uri={photo} name={other?.username} />
        <View style={styles.convoText}>
          <View style={styles.convoTopRow}>
            <Text style={styles.convoName} numberOfLines={1}>
              {other?.username ?? 'User'}
            </Text>
            {lastTime ? <Text style={styles.convoTime}>{lastTime}</Text> : null}
          </View>
          <Text numberOfLines={1} style={styles.convoLastMsg}>
            {lastMsg}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat List</Text>
      </View>
      <View style={styles.divider} />

      {loading && chats.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="chatbubble-ellipses-outline" size={32} color={PINK} />
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
          contentContainerStyle={{ paddingBottom: navBarHeight + 8 }}
        />
      )}

      <Navigation onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#111111', letterSpacing: -0.5 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 20, marginBottom: 4 },
  convoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },

  avatarOuter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
    overflow: 'hidden',
  },

  avatar: { width: 52, height: 52 },
  avatarFallback: {
    backgroundColor: '#FCE7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitial: { fontSize: 20, fontWeight: '700', color: PINK },
  convoText: { flex: 1 },
  convoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },

  convoName: { 
    fontWeight: '600', 
    fontSize: 15, 
    color: '#111111', 
    flex: 1, 
    marginRight: 8 
  },

  convoTime: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    flexShrink: 0 
  },

  convoLastMsg: { 
    fontSize: 13, 
    color: '#9CA3AF', 
    lineHeight: 18 },

  emptyState: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 40 
  },

  emptyIcon: {
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#FCE7EB',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20,
  },

  emptyTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#1F2937', 
    textAlign: 'center', 
    marginBottom: 8 
  },

  emptySubtitle: { 
    fontSize: 14, 
    color: '#9CA3AF', 
    textAlign: 'center', 
    lineHeight: 20, 
    marginBottom: 24 
  },

  swipeBtn: { 
    backgroundColor: PINK, 
    paddingHorizontal: 28, 
    paddingVertical: 12, 
    borderRadius: 99 
  },
  
  swipeBtnText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 15 
  },
});
