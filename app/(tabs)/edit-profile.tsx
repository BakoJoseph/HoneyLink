import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';

import { ME_WITH_COUNTS } from '../../scripts/graphql';
import Navigation from './navigation';

const PINK = '#E8476A';

interface MeQueryData {
  me: {
    username?: string;
    email?: string;
    followerCount?: number;
    followingCount?: number;
    subscription?: { status?: string; plan?: string };
    profile?: {
      bio?: string;
      age?: number;
      city?: string;
      interests?: string[];
      photos?: string[];
    };
  };
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState('profile');
  const [tab, setTab] = useState<'about' | 'gallery'>('about');

  const { data, loading, refetch } = useQuery<MeQueryData>(ME_WITH_COUNTS, {
    fetchPolicy: 'network-only',
  });

  const me = data?.me;

  // Refetch data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleTabPress = (t: string) => {
    setActiveTab(t);
    if (t === 'home') router.push('/homepage');
    if (t === 'favorites') router.push('/matches');
    if (t === 'chatlist') router.push('/chatlist');
    if (t === 'add') router.push('/shorts');
  };

  const photo =
    me?.profile?.photos?.[0] ||
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400';

  const topPad =
    Platform.OS === 'android'
      ? (StatusBar.currentHeight ?? 0) + 8
      : insets.top + 8;

  const hasAnyProfileData =
    me?.profile?.bio ||
    me?.profile?.age ||
    me?.profile?.city ||
    me?.profile?.interests?.length;

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity
          onPress={() => router.push('/edit-profile')}
          style={styles.editIcon}
        >
          <Ionicons name="create-outline" size={24} color={PINK} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
        >
          {/* Avatar + stats */}
          <View style={styles.avatarSection}>
            <Image source={{ uri: photo }} style={styles.avatar} />
            <Text style={styles.name}>{me?.username ?? 'Your Name'}</Text>

            {me?.profile?.city && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={13} color="#888" />
                <Text style={styles.location}>{me.profile.city}</Text>
              </View>
            )}

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{me?.followerCount ?? 0}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{me?.followingCount ?? 0}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>

            {/* Subscription badge */}
            <View
              style={[
                styles.planBadge,
                me?.subscription?.status === 'active' && styles.planBadgePro,
              ]}
            >
              <Text style={styles.planBadgeText}>
                {me?.subscription?.status === 'active'
                  ? `${me.subscription.plan?.toUpperCase()} ✨`
                  : 'FREE'}
              </Text>
            </View>
          </View>

          {/* Sub-tabs: About / Gallery */}
          <View style={styles.tabs}>
            {(['about', 'gallery'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
                onPress={() => setTab(t)}
              >
                <Text
                  style={[styles.tabText, tab === t && styles.tabTextActive]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tab === 'about' ? (
            <View style={styles.aboutSection}>
              <InfoRow
                icon="person-outline"
                label="Username"
                value={me?.username}
              />
              <InfoRow icon="mail-outline" label="Email" value={me?.email} />

              <InfoRow
                icon="calendar-outline"
                label="Age"
                value={
                  me?.profile?.age ? `${me.profile.age} years old` : undefined
                }
                placeholder="Not set"
              />

              <InfoRow
                icon="location-outline"
                label="City"
                value={me?.profile?.city}
                placeholder="Not set"
              />

              {/* Bio */}
              <View style={styles.bioBox}>
                <Text style={styles.fieldLabel}>Bio</Text>
                {me?.profile?.bio ? (
                  <Text style={styles.bioText}>{me.profile.bio}</Text>
                ) : (
                  <TouchableOpacity onPress={() => router.push('/edit-profile')}>
                    <Text style={styles.emptyText}>
                      No bio yet. Tap to add one ✏️
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Interests */}
              <View style={styles.bioBox}>
                <Text style={styles.fieldLabel}>Interests</Text>
                {me?.profile?.interests?.length ? (
                  <View style={styles.tags}>
                    {me.profile.interests.map((interest: string) => (
                      <View key={interest} style={styles.tag}>
                        <Text style={styles.tagText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => router.push('/edit-profile')}>
                    <Text style={styles.emptyText}>
                      No interests added yet. Tap to add some ✏️
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {!hasAnyProfileData && (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="person-circle-outline"
                    size={48}
                    color="#FFD6E0"
                  />
                  <Text style={styles.emptyStateTitle}>Your profile is empty</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Add your bio, age, city and interests so others can get to
                    know you.
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.gallery}>
              {(me?.profile?.photos ?? []).map((uri: string, i: number) => (
                <Image key={i} source={{ uri }} style={styles.galleryImg} />
              ))}

              {(!me?.profile?.photos || me.profile.photos.length === 0) && (
                <Text style={styles.noPhotos}>
                  No photos yet. Edit your profile to add some!
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Navigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  placeholder,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | number;
  placeholder?: string;
}) {
  const displayValue = value ?? placeholder;
  if (!displayValue) return null;

  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color="#aaa" />
      <View style={{ flex: 1 }}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={value ? styles.infoValue : styles.infoValueEmpty}>
          {displayValue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#111' },
  editIcon: { padding: 4 },
  content: {},
  avatarSection: { alignItems: 'center', paddingTop: 24, paddingBottom: 16 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#FFD6E0',
  },
  name: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 4 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 14,
  },
  location: { fontSize: 13, color: '#888' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#FFF5F7',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800', color: PINK },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#FFD6E0',
    marginHorizontal: 16,
  },
  planBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 99,
  },
  planBadgePro: {
    backgroundColor: '#FFF0F5',
    borderWidth: 1,
    borderColor: PINK,
  },
  planBadgeText: { fontSize: 12, fontWeight: '700', color: PINK },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: PINK },
  tabText: { fontSize: 14, fontWeight: '600', color: '#aaa' },
  tabTextActive: { color: PINK },
  aboutSection: { paddingHorizontal: 20, paddingTop: 14 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  fieldLabel: {
    fontSize: 11,
    color: '#bbb',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  infoValue: { fontSize: 15, color: '#222' },
  infoValueEmpty: { fontSize: 15, color: '#ccc', fontStyle: 'italic' },
  bioBox: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  bioText: { fontSize: 15, color: '#444', lineHeight: 22 },
  emptyText: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
    marginTop: 4,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  tag: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#FFD6E0',
  },
  tagText: { fontSize: 13, color: PINK, fontWeight: '600' },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyStateTitle: { fontSize: 16, fontWeight: '700', color: '#aaa' },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 20,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 4,
  },
  galleryImg: { width: '31.5%', aspectRatio: 1, borderRadius: 10 },
  noPhotos: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    paddingVertical: 32,
    width: '100%',
  },
  editBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: PINK,
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
