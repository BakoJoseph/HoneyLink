import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { SEARCH_USERS, FOLLOW_USER, UNFOLLOW_USER, CREATE_CHAT } from '../../scripts/graphql';
import Navigation from './navigation';

const PINK = '#E8476A';

type SearchUser = {
  id: string;
  username: string;
  isFollowing?: boolean;
  profile?: {
    city?: string;
    age?: number;
    photos?: string[];
  };
};

type SearchUsersData = {
  searchUsers: SearchUser[];
};

type CreateChatData = {
  createChat?: {
    id: string;
  };
};

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'android'
    ? (StatusBar.currentHeight ?? 0) + 8
    : insets.top + 8;

  const [activeTab, setActiveTab] = useState('home');
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  // Track follow state locally keyed by userId
  const [followState, setFollowState] = useState<Record<string, boolean>>({});
  const [loadingFollow, setLoadingFollow] = useState<Record<string, boolean>>({});

  const [doSearch, { data, loading }] = useLazyQuery<SearchUsersData>(SEARCH_USERS, {
    fetchPolicy: 'network-only',
  });
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [createChat, { loading: chatLoading }] = useMutation<CreateChatData>(CREATE_CHAT);

  const results = data?.searchUsers ?? [];

  const handleSearch = () => {
    const q = query.trim();
    if (!q) {
      Alert.alert('Search', 'Please enter a username or keyword to search.');
      return;
    }
    doSearch({
      variables: {
        q,
        limit: 20,
        city: city.trim() || undefined,
        minAge: minAge ? parseInt(minAge, 10) : undefined,
        maxAge: maxAge ? parseInt(maxAge, 10) : undefined,
      },
    });
  };

  const toggleFollow = async (userId: string, currentlyFollowing: boolean) => {
    setLoadingFollow((s) => ({ ...s, [userId]: true }));
    try {
      if (currentlyFollowing) {
        await unfollowUser({ variables: { userId } });
        setFollowState((s) => ({ ...s, [userId]: false }));
      } else {
        await followUser({ variables: { userId } });
        setFollowState((s) => ({ ...s, [userId]: true }));
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoadingFollow((s) => ({ ...s, [userId]: false }));
    }
  };

  const handleMessage = async (userId: string, username: string) => {
    try {
      const { data: chatData } = await createChat({ variables: { userId } });
      if (chatData?.createChat?.id) {
        router.push({
          pathname: '/chat-room',
          params: { chatId: chatData.createChat.id, chatName: username },
        });
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') router.push('/homepage');
    if (tab === 'favorites') router.push('/matches');
    if (tab === 'chatlist') router.push('/chatlist');
    if (tab === 'profile') router.push('/profile');
    if (tab === 'add') router.push('/shorts');
  };

  const renderItem = ({ item }: { item: SearchUser }) => {
    const photo = item.profile?.photos?.[0] ||
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200';
    const isFollowing = followState[item.id] ?? item.isFollowing ?? false;
    const followLoading = loadingFollow[item.id] ?? false;

    return (
      <View style={styles.resultRow}>
        <Image source={{ uri: photo }} style={styles.avatar} />
        <View style={styles.resultInfo}>
          <Text style={styles.resultName}>{item.username}</Text>
          <Text style={styles.resultMeta}>
            {[item.profile?.city, item.profile?.age ? `${item.profile.age} yo` : null]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>
        <View style={styles.resultActions}>
          {/* Follow / Unfollow */}
          <TouchableOpacity
            style={[styles.actionBtn, isFollowing ? styles.followingBtn : styles.followBtn]}
            onPress={() => toggleFollow(item.id, isFollowing)}
            disabled={followLoading}>
            {followLoading ? (
              <ActivityIndicator size="small" color={isFollowing ? '#888' : '#fff'} />
            ) : (
              <Text style={[styles.actionBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Message */}
          <TouchableOpacity
            style={styles.msgIconBtn}
            onPress={() => handleMessage(item.id, item.username)}
            disabled={chatLoading}>
            <Ionicons name="chatbubble-outline" size={20} color={PINK} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      {/* Responsive header */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={styles.title}>Search People</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#aaa" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username…"
          placeholderTextColor="#C4C4C4"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.filterInput}
          placeholder="City"
          placeholderTextColor="#C4C4C4"
          value={city}
          onChangeText={setCity}
          autoCapitalize="words"
        />
        <TextInput
          style={[styles.filterInput, styles.filterInputSmall]}
          placeholder="Min age"
          placeholderTextColor="#C4C4C4"
          value={minAge}
          onChangeText={setMinAge}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.filterInput, styles.filterInputSmall]}
          placeholder="Max age"
          placeholderTextColor="#C4C4C4"
          value={maxAge}
          onChangeText={setMaxAge}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            data ? (
              <View style={styles.centered}>
                <Ionicons name="search-outline" size={48} color="#ddd" />
                <Text style={styles.emptyText}>No users found</Text>
                <Text style={styles.emptyHint}>Try a different name or remove filters</Text>
              </View>
            ) : (
              <View style={styles.centered}>
                <Ionicons name="people-outline" size={48} color="#ddd" />
                <Text style={styles.emptyText}>Search for people</Text>
                <Text style={styles.emptyHint}>Find users by username, city, or age</Text>
              </View>
            )
          }
          renderItem={renderItem}
        />
      )}

      <Navigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 48, gap: 8 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#111' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
  },
  searchInput: { flex: 1, fontSize: 15, color: '#111' },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  filterInput: {
    flex: 2,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#111',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  filterInputSmall: { flex: 1 },
  searchBtn: {
    backgroundColor: PINK,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  list: { paddingHorizontal: 16 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
    gap: 12,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#FFE0E8' },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 2 },
  resultMeta: { fontSize: 13, color: '#999' },
  resultActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 99,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followBtn: { backgroundColor: PINK },
  followingBtn: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  followingBtnText: { color: '#666' },
  msgIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFF0F5',
    alignItems: 'center', justifyContent: 'center',
  },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#aaa' },
  emptyHint: { fontSize: 13, color: '#ccc' },
});
