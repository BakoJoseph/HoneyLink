import React, { useRef, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { SWIPE_FEED } from '../../scripts/graphql';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 10;
const CARD_SIZE = (SCREEN_WIDTH - 32 - CARD_GAP) / 2;

const COLORS = {
  bg: '#F7F5F2',
  white: '#FFFFFF',
  pink: '#E8385A',
  text: '#1A1A1A',
  textMuted: '#9B9B9B',
  overlay: 'rgba(0,0,0,0.65)',
  chip: '#F0E8EC',
  chipActive: '#E8385A',
};

const PINK = '#E8476A';

const INTERESTS_LIST = [
  'ðŸŽµ Music', 'ðŸ‹ï¸ Fitness', 'ðŸ“š Reading', 'ðŸŽ® Gaming',
  'âœˆï¸ Travel', 'ðŸ• Foodie', 'ðŸŽ¨ Art', 'ðŸŠ Swimming',
  'ðŸŽ¬ Movies', 'ðŸ¾ Pets', 'ðŸ“¸ Photography', 'ðŸŒ¿ Nature',
];

const GENDERS = ['Male', 'Female', 'Everyone'];

type FeedUser = {
  id: string;
  username: string;
  profile: {
    bio?: string;
    age?: number;
    gender?: string;
    city?: string;
    photos?: string[];
    interests?: string[];
  };
};

function ConfettiPiece({ x, delay, color }: { x: number; delay: number; color: string }) {
  const translateY = useRef(new Animated.Value(-10)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 300, duration: 1200, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 1200, delay, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 6, duration: 1200, delay, useNativeDriver: true }),
    ]).start();
  }, [delay, opacity, rotate, translateY]);

  const spin = rotate.interpolate({ inputRange: [0, 6], outputRange: ['0deg', '540deg'] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: 60,
        width: 8,
        height: 8,
        borderRadius: 2,
        backgroundColor: color,
        transform: [{ translateY }, { rotate: spin }],
        opacity,
      }}
    />
  );
}

function MatchModal({
  visible,
  user,
  onMessage,
  onDismiss,
}: {
  visible: boolean;
  user: FeedUser | null;
  onMessage: () => void;
  onDismiss: () => void;
}) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0.7);
      opacity.setValue(0);
    }
  }, [opacity, scale, visible]);

  const confettiColors = [COLORS.pink, '#FFD166', '#FFFFFF', '#A8DADC', '#F4A261'];
  const pieces = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * (SCREEN_WIDTH - 20),
    delay: Math.random() * 300,
    color: confettiColors[i % confettiColors.length],
  }));

  const photo = user?.profile?.photos?.[0];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.matchBackdrop}>
        {pieces.map((piece) => (
          <ConfettiPiece key={piece.id} x={piece.x} delay={piece.delay} color={piece.color} />
        ))}
        <Animated.View style={[styles.matchCard, { transform: [{ scale }], opacity }]}>
          <Ionicons name="heart" size={36} color={COLORS.pink} style={{ marginBottom: 8 }} />
          <Text style={styles.matchTitle}>Congrats it&apos;s a Match!</Text>
          <Text style={styles.matchSub}>Start a conversation now</Text>

          <View style={styles.matchAvatars}>
            <View style={[styles.matchAvatar, { backgroundColor: '#C9847A' }]}>
              <Text style={styles.matchAvatarText}>You</Text>
            </View>
            <View style={styles.matchHeartBadge}>
              <Ionicons name="heart" size={14} color="#fff" />
            </View>
            {photo ? (
              <Image source={{ uri: photo }} style={[styles.matchAvatar, { borderWidth: 3, borderColor: COLORS.white }]} />
            ) : (
              <View style={[styles.matchAvatar, { backgroundColor: COLORS.pink }]}>
                <Text style={styles.matchAvatarText}>{user?.username?.[0]?.toUpperCase() ?? '?'}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.matchMsgBtn} onPress={onMessage} activeOpacity={0.85}>
            <Text style={styles.matchMsgBtnText}>Send Message</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDismiss} style={styles.matchSkip}>
            <Text style={styles.matchSkipText}>Keep playing</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

function FullScreenProfile({
  user,
  onClose,
  onLike,
  onPass,
}: {
  user: FeedUser;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
}) {
  const likeScale = useRef(new Animated.Value(1)).current;
  const passScale = useRef(new Animated.Value(1)).current;

  const animateBtn = (anim: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 1.25, friction: 4, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => callback());
  };

  const photo = user.profile?.photos?.[0];

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={styles.fullScreen}>
        <StatusBar barStyle="light-content" />

        {photo ? (
          <Image source={{ uri: photo }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <View style={[styles.fullPhoto, { backgroundColor: COLORS.pink }]}>
            <Ionicons name="person" size={80} color="rgba(255,255,255,0.25)" />
          </View>
        )}

        <View style={styles.fullGradient} />

        <SafeAreaView style={styles.fullTopBar}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.fullInfo}>
          <Text style={styles.fullName}>
            {user.username}{user.profile?.age ? `, ${user.profile.age}` : ''}
          </Text>
          {user.profile?.city ? (
            <Text style={styles.fullRole}>ðŸ“ {user.profile.city}</Text>
          ) : null}
          {user.profile?.bio ? (
            <Text style={styles.fullBio}>{user.profile.bio}</Text>
          ) : null}
          {user.profile?.interests && user.profile.interests.length > 0 ? (
            <View style={styles.interestRow}>
              {user.profile.interests.slice(0, 4).map((tag) => (
                <View key={tag} style={styles.interestBadge}>
                  <Text style={styles.interestBadgeText}>{tag}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.fullActions}>
          <Animated.View style={{ transform: [{ scale: passScale }] }}>
            <TouchableOpacity
              style={styles.passBtn}
              onPress={() => animateBtn(passScale, onPass)}
              activeOpacity={0.85}>
              <Ionicons name="close" size={30} color="#999" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <TouchableOpacity
              style={styles.likeBtn}
              onPress={() => animateBtn(likeScale, onLike)}
              activeOpacity={0.85}>
              <Ionicons name="heart" size={30} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

function ProfileCard({ user, onPress }: { user: FeedUser; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => onPress());
  };

  const photo = user.profile?.photos?.[0];
  const CARD_COLORS = ['#C9847A', '#7A9EC9', '#8DC97A', '#C9A87A', '#A07AC9', '#7AC9B8'];
  const fallbackColor = CARD_COLORS[parseInt(user.id, 16) % CARD_COLORS.length] ?? '#C9847A';

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        {photo ? (
          <Image source={{ uri: photo }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <View style={[styles.cardPhoto, { backgroundColor: fallbackColor }]}>
            <Ionicons name="person" size={40} color="rgba(255,255,255,0.4)" />
          </View>
        )}
        <View style={styles.cardGradient} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{user.username}</Text>
          {user.profile?.age ? (
            <Text style={styles.cardRole}>Age {user.profile.age}</Text>
          ) : null}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

type Filters = {
  minAge: number;
  maxAge: number;
  gender: string;
  interests: string[];
};

function FilterSheet({
  visible,
  filters,
  onApply,
  onClose,
}: {
  visible: boolean;
  filters: Filters;
  onApply: (f: Filters) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<Filters>(filters);

  React.useEffect(() => {
    if (visible) setLocal(filters);
  }, [visible, filters]);

  const toggleInterest = (tag: string) => {
    setLocal((prev) => ({
      ...prev,
      interests: prev.interests.includes(tag)
        ? prev.interests.filter((t) => t !== tag)
        : [...prev.interests, tag],
    }));
  };

  const nudgeAge = (field: 'minAge' | 'maxAge', delta: number) => {
    setLocal((prev) => {
      const next = { ...prev, [field]: Math.max(18, Math.min(99, prev[field] + delta)) };
      if (next.minAge > next.maxAge) next.maxAge = next.minAge;
      if (next.maxAge < next.minAge) next.minAge = next.maxAge;
      return next;
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.filterBackdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.filterSheet}>
        <View style={styles.filterHandle} />
        <Text style={styles.filterTitle}>Filter Discover</Text>

        <Text style={styles.filterLabel}>Age Range</Text>
        <View style={styles.ageRow}>
          <View style={styles.agePicker}>
            <TouchableOpacity onPress={() => nudgeAge('minAge', -1)} style={styles.ageBtn}>
              <Ionicons name="remove" size={18} color={COLORS.pink} />
            </TouchableOpacity>
            <Text style={styles.ageValue}>{local.minAge}</Text>
            <TouchableOpacity onPress={() => nudgeAge('minAge', 1)} style={styles.ageBtn}>
              <Ionicons name="add" size={18} color={COLORS.pink} />
            </TouchableOpacity>
          </View>
          <Text style={styles.ageSep}>â€“</Text>
          <View style={styles.agePicker}>
            <TouchableOpacity onPress={() => nudgeAge('maxAge', -1)} style={styles.ageBtn}>
              <Ionicons name="remove" size={18} color={COLORS.pink} />
            </TouchableOpacity>
            <Text style={styles.ageValue}>{local.maxAge}</Text>
            <TouchableOpacity onPress={() => nudgeAge('maxAge', 1)} style={styles.ageBtn}>
              <Ionicons name="add" size={18} color={COLORS.pink} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.filterLabel}>Show Me</Text>
        <View style={styles.chipRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, local.gender === g && styles.chipActive]}
              onPress={() => setLocal((p) => ({ ...p, gender: g }))}>
              <Text style={[styles.chipText, local.gender === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.filterLabel}>Interests (match at least one)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          <View style={styles.chipRow}>
            {INTERESTS_LIST.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.chip, local.interests.includes(tag) && styles.chipActive]}
                onPress={() => toggleInterest(tag)}>
                <Text style={[styles.chipText, local.interests.includes(tag) && styles.chipTextActive]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.applyBtn} onPress={() => { onApply(local); onClose(); }} activeOpacity={0.85}>
          <Text style={styles.applyBtnText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

type SwipeFeedData = { swipeFeed: FeedUser[] };

export default function DiscoveryScreen() {
  const [selectedUser, setSelectedUser] = useState<FeedUser | null>(null);
  const [matchedUser, setMatchedUser] = useState<FeedUser | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const matchPending = useRef(false);

  const [filters, setFilters] = useState<Filters>({
    minAge: 18,
    maxAge: 50,
    gender: 'Any',
    interests: [],
  });

  const { data, loading, error } = useQuery<SwipeFeedData>(SWIPE_FEED, {
    variables: { limit: 100 },
  });

  const feed: FeedUser[] = useMemo(() => {
    const all = data?.swipeFeed ?? [];
    return all.filter((u) => {
      const age = u.profile?.age ?? 0;
      if (age > 0 && (age < filters.minAge || age > filters.maxAge)) return false;

      if (filters.gender !== 'Any') {
        const g = u.profile?.gender?.toLowerCase() ?? '';
        if (g && g !== filters.gender.toLowerCase()) return false;
      }

      if (filters.interests.length > 0) {
        const userInterests = u.profile?.interests ?? [];
        const hasCommon = filters.interests.some((f) =>
          userInterests.some((ui) => ui.toLowerCase().includes(f.replace(/^\S+\s/, '').toLowerCase()))
        );
        if (!hasCommon) return false;
      }

      return true;
    });
  }, [data, filters]);

  const handleLike = () => {
    if (!selectedUser) return;
    const user = selectedUser;
    setSelectedUser(null);

    if (!matchPending.current && Math.random() < 0.4) {
      matchPending.current = true;
      setTimeout(() => {
        setMatchedUser(user);
        setShowMatch(true);
      }, 300);
    }
  };

  const handlePass = () => setSelectedUser(null);

  const closeMatch = () => {
    setShowMatch(false);
    matchPending.current = false;
  };

  const activeFilterCount =
    (filters.gender !== 'Any' ? 1 : 0) +
    (filters.interests.length > 0 ? 1 : 0) +
    (filters.minAge !== 18 || filters.maxAge !== 50 ? 1 : 0);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.navbar}>
        <View style={styles.navBack} />
        <Text style={styles.navTitle}>Discover</Text>
        <TouchableOpacity style={styles.navIconBtn} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={22} color={activeFilterCount > 0 ? COLORS.pink : COLORS.textMuted} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {activeFilterCount > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFiltersBar}>
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 }}>
            {(filters.minAge !== 18 || filters.maxAge !== 50) && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Age {filters.minAge}â€“{filters.maxAge}</Text>
              </View>
            )}
            {filters.gender !== 'Any' && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>{filters.gender}</Text>
              </View>
            )}
            {filters.interests.map((i) => (
              <View key={i} style={styles.activePill}>
                <Text style={styles.activePillText}>{i}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.pink} />
          <Text style={styles.loadingText}>Finding people near youâ€¦</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="wifi-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Couldn&apos;t load feed</Text>
          <Text style={styles.emptySub}>{error.message}</Text>
        </View>
      ) : feed.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="search-outline" size={52} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No matches for your filters</Text>
          <Text style={styles.emptySub}>Try widening your age range or removing some filters</Text>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setFilters({ minAge: 18, maxAge: 50, gender: 'Any', interests: [] })}>
            <Text style={styles.clearBtnText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={feed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProfileCard user={item} onPress={() => setSelectedUser(item)} />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedUser ? (
        <FullScreenProfile
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onLike={handleLike}
          onPass={handlePass}
        />
      ) : null}

      <MatchModal
        visible={showMatch}
        user={matchedUser}
        onMessage={closeMatch}
        onDismiss={closeMatch}
      />

      <FilterSheet
        visible={showFilters}
        filters={filters}
        onApply={setFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { color: COLORS.textMuted, marginTop: 12, fontSize: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 16, textAlign: 'center' },
  emptySub: { fontSize: 13, color: COLORS.textMuted, marginTop: 8, textAlign: 'center' },
  clearBtn: { marginTop: 20, backgroundColor: COLORS.pink, borderRadius: 50, paddingHorizontal: 24, paddingVertical: 12 },
  clearBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bg,
  },
  navBack: { width: 36, height: 36 },
  navTitle: { fontSize: 22, fontWeight: '800', color: PINK },
  navIconBtn: { minWidth: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: { color: COLORS.white, fontSize: 9, fontWeight: '800' },
  activeFiltersBar: { maxHeight: 40 },
  activePill: {
    backgroundColor: COLORS.chipActive,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  activePillText: { color: COLORS.white, fontSize: 11, fontWeight: '600' },
  grid: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
  row: { gap: CARD_GAP, marginBottom: CARD_GAP },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.35,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#CCCCCC',
  },
  cardPhoto: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  cardInfo: { position: 'absolute', bottom: 10, left: 10 },
  cardName: { color: COLORS.white, fontSize: 13, fontWeight: '700', letterSpacing: -0.2 },
  cardRole: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '500' },
  fullScreen: { flex: 1, backgroundColor: '#000000' },
  fullPhoto: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  fullGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  fullTopBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 8 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullInfo: { position: 'absolute', bottom: 140, left: 24, right: 24 },
  fullName: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  fullRole: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500', marginTop: 4 },
  fullBio: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 8, lineHeight: 18 },
  interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  interestBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  interestBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '600' },
  fullActions: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    alignItems: 'center',
  },
  passBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  likeBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.pink,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  matchBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchCard: {
    width: SCREEN_WIDTH * 0.82,
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  matchTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.pink,
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  matchSub: { fontSize: 13, color: COLORS.textMuted, marginBottom: 24, textAlign: 'center' },
  matchAvatars: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  matchAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  matchAvatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  matchHeartBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -8,
    zIndex: 2,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  matchMsgBtn: {
    width: '100%',
    backgroundColor: COLORS.pink,
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  matchMsgBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  matchSkip: { paddingVertical: 6 },
  matchSkipText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '500' },
  filterBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  filterSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  filterHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  filterTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  filterLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted, marginBottom: 10, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  ageRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  agePicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.chip,
    borderRadius: 14,
    padding: 10,
  },
  ageBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  ageValue: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  ageSep: { fontSize: 18, color: COLORS.textMuted, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    backgroundColor: COLORS.chip,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: { backgroundColor: COLORS.chipActive },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  chipTextActive: { color: COLORS.white },
  applyBtn: {
    backgroundColor: COLORS.pink,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  applyBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});
