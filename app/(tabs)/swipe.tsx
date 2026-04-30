import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { SWIPE_FEED, SWIPE } from '../../scripts/graphql';
import Navigation from './navigation';

const PINK = '#E8476A';
const SWIPE_THRESHOLD = 100;

type SwipeUser = {
  id: string;
  username: string;
  profile?: {
    age?: number;
    bio?: string;
    city?: string;
    photos?: string[];
  };
};

type SwipeFeedData = {
  swipeFeed: SwipeUser[];
};

type SwipeMutationData = {
  swipe?: {
    matched?: boolean;
  };
};

function SwipeCard({ user, onSwipe }: { user: SwipeUser; onSwipe: (dir: string) => void }) {
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-15deg', '0deg', '15deg'] });
  const likeOpacity = position.x.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = position.x.interpolate({ inputRange: [-80, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  const photo = user?.profile?.photos?.[0] || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400';

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => position.setValue({ x: gesture.dx, y: gesture.dy }),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        Animated.timing(position, { toValue: { x: 600, y: gesture.dy }, duration: 250, useNativeDriver: true }).start(() => onSwipe('RIGHT'));
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        Animated.timing(position, { toValue: { x: -600, y: gesture.dy }, duration: 250, useNativeDriver: true }).start(() => onSwipe('LEFT'));
      } else {
        Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
      }
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.card, { transform: [...position.getTranslateTransform(), { rotate }] }]}>
      <Image source={{ uri: photo }} style={styles.cardImage} />
      <Animated.View style={[styles.likeStamp, { opacity: likeOpacity }]}>
        <Text style={styles.likeText}>LIKE 💚</Text>
      </Animated.View>
      <Animated.View style={[styles.nopeStamp, { opacity: nopeOpacity }]}>
        <Text style={styles.nopeText}>NOPE ✕</Text>
      </Animated.View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{user.username}, {user.profile?.age ?? '?'}</Text>
        <Text style={styles.cardCity}>{user.profile?.city ?? ''}</Text>
        {user.profile?.bio ? <Text style={styles.cardBio} numberOfLines={2}>{user.profile.bio}</Text> : null}
      </View>
    </Animated.View>
  );
}

export default function SwipeScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [matchModal, setMatchModal] = useState(false);

  const { data, loading, error, refetch } = useQuery<SwipeFeedData>(SWIPE_FEED, { variables: { limit: 20 } });
  const [doSwipe] = useMutation<SwipeMutationData>(SWIPE);

  const users = data?.swipeFeed ?? [];
  const currentUser = users[index];

  const handleSwipe = async (direction: string) => {
    if (!currentUser) return;
    try {
      const { data: swipeData } = await doSwipe({ variables: { toUserId: currentUser.id, direction } });
      if (swipeData?.swipe?.matched) setMatchModal(true);
    } catch {
      // silent
    }
    setIndex((i) => i + 1);
  };

  const handleTabPress = (tab: string) => {
    if (tab === 'home') router.push('/homepage');
    if (tab === 'favorites') router.push('/matches');
    if (tab === 'chatlist') router.push('/chatlist' as any);
    if (tab === 'profile') router.push('/profile');
    if (tab === 'add') router.push('/shorts');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={PINK} />
      </SafeAreaView>
    );
  }

  if (error || users.length === 0 || index >= users.length) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.logo}>HonyLink 💕</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No more profiles</Text>
          <Text style={styles.emptySubtitle}>Check back soon for new matches!</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => { setIndex(0); refetch(); }}>
            <Text style={styles.refreshBtnText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <Navigation onTabPress={handleTabPress} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.logo}>HonyLink 💕</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardStack}>
        {users.slice(index, index + 3).reverse().map((u, i, arr) => (
          i === arr.length - 1 ? (
            <SwipeCard key={u.id} user={u} onSwipe={handleSwipe} />
          ) : (
            <View key={u.id} style={[styles.card, styles.cardBehind, { bottom: (arr.length - 1 - i) * -8, transform: [{ scale: 1 - (arr.length - 1 - i) * 0.04 }] }]} />
          )
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.nopeBtn]} onPress={() => handleSwipe('LEFT')}>
          <Ionicons name="close" size={30} color="#FF6B6B" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]} onPress={() => handleSwipe('RIGHT')}>
          <Ionicons name="heart" size={30} color={PINK} />
        </TouchableOpacity>
      </View>

      <Navigation onTabPress={handleTabPress} />

      <Modal visible={matchModal} transparent animationType="fade">
        <View style={styles.matchOverlay}>
          <View style={styles.matchCard}>
            <Text style={styles.matchTitle}>It&apos;s a Match! 🎉</Text>
            <Text style={styles.matchSubtitle}>You and {currentUser?.username} liked each other.</Text>
            <TouchableOpacity style={styles.matchBtn} onPress={() => { setMatchModal(false); router.push('/matches'); }}>
              <Text style={styles.matchBtnText}>View Matches</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMatchModal(false)}>
              <Text style={styles.matchContinue}>Keep Swiping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF5F7' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  logo: { fontSize: 22, fontWeight: '800', color: PINK },
  cardStack: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    position: 'absolute',
    width: 340,
    height: 480,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cardBehind: { backgroundColor: '#ffe4ec' },
  cardImage: { width: '100%', height: '75%', resizeMode: 'cover' },
  cardInfo: { padding: 16 },
  cardName: { fontSize: 22, fontWeight: '700', color: '#111' },
  cardCity: { fontSize: 14, color: '#888', marginTop: 2 },
  cardBio: { fontSize: 13, color: '#555', marginTop: 6, lineHeight: 18 },
  likeStamp: { position: 'absolute', top: 40, left: 20, borderWidth: 3, borderColor: '#00C853', borderRadius: 6, padding: 6 },
  likeText: { fontSize: 22, fontWeight: '800', color: '#00C853' },
  nopeStamp: { position: 'absolute', top: 40, right: 20, borderWidth: 3, borderColor: '#FF6B6B', borderRadius: 6, padding: 6 },
  nopeText: { fontSize: 22, fontWeight: '800', color: '#FF6B6B' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 40, paddingVertical: 16 },
  actionBtn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  nopeBtn: { backgroundColor: '#FFF0F0' },
  likeBtn: { backgroundColor: '#FFF0F5' },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24, paddingHorizontal: 32 },
  refreshBtn: { backgroundColor: PINK, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 99 },
  refreshBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  matchOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  matchCard: { backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center', width: 300 },
  matchTitle: { fontSize: 28, fontWeight: '800', color: PINK, marginBottom: 10 },
  matchSubtitle: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  matchBtn: { backgroundColor: PINK, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 99, marginBottom: 14 },
  matchBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  matchContinue: { fontSize: 14, color: '#888' },
});
