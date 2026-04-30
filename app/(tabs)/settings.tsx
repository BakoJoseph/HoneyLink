import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { ME, SUBSCRIBE } from '../../scripts/graphql';
import { deleteToken } from '../../scripts/auth';

const PINK = '#E8476A';

type MeData = {
  me?: {
    username?: string;
    email?: string;
    isVerified?: boolean;
    subscription?: {
      plan?: string;
      status?: string;
    };
  };
};

const PLANS = [
  {
    id: 'basic',
    label: 'Basic',
    price: '$4.99 / mo',
    features: ['Unlimited swipes', 'See who liked you', 'Access to Shorts'],
  },
  {
    id: 'premium',
    label: 'Premium',
    price: '$9.99 / mo',
    features: ['Everything in Basic', 'Priority matching', 'Profile boost', 'Advanced filters'],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { data, loading } = useQuery<MeData>(ME);
  const [doSubscribe, { loading: subLoading }] = useMutation(SUBSCRIBE);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const me = data?.me;
  const currentPlan = me?.subscription?.plan ?? 'free';
  const subStatus = me?.subscription?.status ?? 'inactive';

  const handleSubscribe = async (plan: string) => {
    setSelectedPlan(plan);
    try {
      await doSubscribe({ variables: { plan } });
      Alert.alert('Subscribed!', `You are now on the ${plan} plan.`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSelectedPlan(null);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await deleteToken();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 34 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Account info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{me?.username ?? '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{me?.email ?? '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color={me?.isVerified ? '#22C55E' : '#888'} />
              <Text style={styles.infoText}>{me?.isVerified ? 'Verified' : 'Not verified'}</Text>
            </View>
          </View>

          {/* Current subscription */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <View style={styles.currentPlanBadge}>
              <Text style={styles.currentPlanLabel}>Current plan</Text>
              <Text style={styles.currentPlanValue}>{currentPlan.toUpperCase()} — {subStatus}</Text>
            </View>
          </View>

          {/* Plan cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upgrade Plan</Text>
            {PLANS.map((plan) => {
              const isActive = currentPlan === plan.id && subStatus === 'active';
              const isLoading = subLoading && selectedPlan === plan.id;
              return (
                <View key={plan.id} style={[styles.planCard, isActive && styles.planCardActive]}>
                  <View style={styles.planCardHeader}>
                    <View>
                      <Text style={styles.planLabel}>{plan.label}</Text>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                    </View>
                    {isActive && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>Active</Text>
                      </View>
                    )}
                  </View>
                  {plan.features.map((f) => (
                    <View key={f} style={styles.featureRow}>
                      <Ionicons name="checkmark" size={16} color={PINK} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                  {!isActive && (
                    <TouchableOpacity
                      style={styles.subBtn}
                      onPress={() => handleSubscribe(plan.id)}
                      disabled={subLoading}>
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.subBtnText}>Subscribe</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF4D4D" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#111' },
  content: { paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 40 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  infoText: { fontSize: 15, color: '#333' },
  currentPlanBadge: {
    backgroundColor: '#FFF5F7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFD6E0',
  },
  currentPlanLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  currentPlanValue: { fontSize: 18, fontWeight: '700', color: PINK },
  planCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 18,
    marginBottom: 14,
  },
  planCardActive: { borderColor: PINK, backgroundColor: '#FFF5F7' },
  planCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  planLabel: { fontSize: 18, fontWeight: '800', color: '#111' },
  planPrice: { fontSize: 14, color: '#666', marginTop: 2 },
  activeBadge: { backgroundColor: PINK, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  activeBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  featureText: { fontSize: 14, color: '#555' },
  subBtn: {
    backgroundColor: PINK,
    borderRadius: 99,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  subBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#FF4D4D' },
});
