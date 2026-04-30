import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { MY_MATCHES, CREATE_CHAT } from '../../scripts/graphql';
import Navigation from './navigation';

const PINK = '#E8476A';

type MatchUser = {
  id: string;
  username?: string;
  profile?: {
    city?: string;
    photos?: string[];
  };
};

type MatchItem = {
  id: string;
  users?: MatchUser[];
};

type MatchesData = {
  myMatches: MatchItem[];
};

type CreateChatData = {
  createChat?: {
    id: string;
  };
};

export default function MatchesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('favorites');
  const { data, loading } = useQuery<MatchesData>(MY_MATCHES);
  const [createChat, { loading: chatLoading }] = useMutation<CreateChatData>(CREATE_CHAT);

  const matches = data?.myMatches ?? [];

  const handleMessage = async (userId: string, username?: string) => {
    try {
      const { data: chatData } = await createChat({ variables: { userId } });
      if (chatData?.createChat?.id) {
        router.push({
          pathname: '/chat-room',
          params: { chatId: chatData.createChat.id, chatName: username ?? 'Chat' },
        });
      }
    } catch (e: any) {
      console.warn('Create chat error:', e.message);
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') router.push('/homepage');
    if (tab === 'chatlist') router.push('/chatlist');
    if (tab === 'profile') router.push('/profile');
    if (tab === 'add') router.push('/shorts');
  };

  const renderItem = ({ item }: { item: MatchItem }) => {
    const other = item.users?.find((u) => Boolean(u?.id));
    const photo =
      other?.profile?.photos?.[0] ||
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200';

    return (
      <View style={styles.matchCard}>
        <Image source={{ uri: photo }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{other?.username ?? 'Match'}</Text>
          <Text style={styles.city}>{other?.profile?.city ?? ''}</Text>
        </View>
        <TouchableOpacity
          style={styles.msgBtn}
          onPress={() => other?.id && handleMessage(other.id, other.username)}
          disabled={chatLoading || !other?.id}>
          <Text style={styles.msgBtnText}>Message</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Matches 💕</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptySub}>Keep swiping to find your match!</Text>
          <TouchableOpacity style={styles.swipeBtn} onPress={() => router.push('/homepage')}>
            <Text style={styles.swipeBtnText}>Start Swiping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Navigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: '#111' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#888', marginBottom: 24 },
  swipeBtn: { backgroundColor: PINK, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 99 },
  swipeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 14 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#111' },
  city: { fontSize: 13, color: '#888', marginTop: 2 },
  msgBtn: {
    backgroundColor: PINK,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
  },
  msgBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
