import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { SHORTS_FEED, ME } from '../../scripts/graphql';
import Navigation from './navigation';

const PINK = '#E8476A';
const { height } = Dimensions.get('window');

type MeData = {
  me?: {
    subscription?: {
      status?: string;
    };
  };
};

type ShortItemData = {
  id: string;
  caption?: string;
  author?: {
    username?: string;
  };
};

type ShortsFeedData = {
  shortsFeed: ShortItemData[];
};

function ShortItem({ item }: { item: ShortItemData }) {
  return (
    <View style={styles.shortItem}>
      {/* Video placeholder — swap for expo-av Video when ready */}
      <View style={styles.videoPlaceholder}>
        <Ionicons name="play-circle" size={64} color="rgba(255,255,255,0.8)" />
      </View>
      <View style={styles.overlay}>
        <Text style={styles.caption}>{item.caption ?? ''}</Text>
        <Text style={styles.authorName}>@{item.author?.username ?? 'user'}</Text>
      </View>
    </View>
  );
}

export default function ShortsScreen() {
  const router = useRouter();

  const { data: meData, loading: meLoading } = useQuery<MeData>(ME);
  const { data, loading } = useQuery<ShortsFeedData>(SHORTS_FEED, { variables: { limit: 20 } });

  const isSubscribed = meData?.me?.subscription?.status === 'active';
  const shorts = data?.shortsFeed ?? [];

  const handleTabPress = (tab: string) => {
    if (tab === 'home') router.push('/homepage');
    if (tab === 'favorites') router.push('/matches');
    if (tab === 'chatlist') router.push('/chatlist' as any);
    if (tab === 'profile') router.push('/profile');
  };

  if (meLoading || loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={PINK} />
      </SafeAreaView>
    );
  }

  if (!isSubscribed) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.gateContainer}>
          <Ionicons name="lock-closed" size={56} color={PINK} style={{ marginBottom: 20 }} />
          <Text style={styles.gateTitle}>Shorts are for subscribers</Text>
          <Text style={styles.gateSub}>
            Upgrade to a HonyLink subscription to watch and upload short videos.
          </Text>
          <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.push('/settings')}>
            <Text style={styles.upgradeBtnText}>View Plans</Text>
          </TouchableOpacity>
        </View>
        <Navigation onTabPress={handleTabPress} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={shorts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ShortItem item={item} />}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 120}
        decelerationRate="fast"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam-outline" size={56} color="#ccc" />
            <Text style={styles.emptyText}>No shorts yet — be the first!</Text>
          </View>
        }
      />
      <Navigation onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF5F7' },
  centered: { flex: 1, backgroundColor: '#FFF5F7', alignItems: 'center', justifyContent: 'center' },
  gateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F7',
    paddingHorizontal: 36,
  },
  gateTitle: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 12, textAlign: 'center' },
  gateSub: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  upgradeBtn: { backgroundColor: PINK, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 99 },
  upgradeBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  shortItem: {
    height: height - 120,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
  },
  caption: { fontSize: 16, color: '#fff', fontWeight: '600', marginBottom: 4 },
  authorName: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  emptyContainer: {
    height: height - 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: { fontSize: 16, color: '#888' },
});
