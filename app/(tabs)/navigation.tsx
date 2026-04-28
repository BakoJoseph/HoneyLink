import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  activeTab: string;
  onTabPress?: (tab: string) => void;
};

const PINK = '#FF4D6D';
const GREY = '#999';

const Navigation: React.FC<Props> = ({ activeTab, onTabPress }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 4) + 4;
  const barHeight = 60 + bottomPad;

  const go = (tab: string) => {
    onTabPress?.(tab);

    if (tab === 'home') router.push('/homepage');
    if (tab === 'favorites') router.push('/matches');
    if (tab === 'messages') router.push('/messages');
    if (tab === 'profile') router.push('/profile');
    if (tab === 'add') router.push('/shorts');
  };

  const color = (tab: string) => (activeTab === tab ? PINK : GREY);

  return (
    <View style={[styles.bar, { height: barHeight, paddingBottom: bottomPad }]}>
      <TouchableOpacity style={styles.tab} onPress={() => go('home')}>
        <Ionicons name="home-outline" size={24} color={color('home')} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => go('favorites')}>
        <Ionicons name="heart-outline" size={24} color={color('favorites')} />
      </TouchableOpacity>

      <View style={styles.fabPlaceholder} />

      <TouchableOpacity style={styles.tab} onPress={() => go('messages')}>
        <Ionicons name="chatbubble-outline" size={24} color={color('messages')} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => go('profile')}>
        <Ionicons name="person-outline" size={24} color={color('profile')} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.fab} onPress={() => go('add')} activeOpacity={0.85}>
        <Ionicons name="play" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    paddingHorizontal: 8,
    elevation: 8,
    zIndex: 100,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },

  fabPlaceholder: {
    width: 68,
  },

  fab: {
    position: 'absolute',
    left: '50%',
    bottom: 18,
    width: 60,
    height: 60,
    marginLeft: -30,
    borderRadius: 30,
    backgroundColor: '#FF4D6D',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#FF4D6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    zIndex: 10,
  },
});

export default Navigation;
