import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useQuery, useMutation } from '@apollo/client/react';
import { ME, UPDATE_PROFILE } from '../../scripts/graphql';   // ← Make sure this path is correct

const PINK = '#E8476A';

interface MeData {
  me: {
    id: string;
    username: string;
    email: string;
    profile: {
      bio?: string;
      age?: number;
      city?: string;
      interests?: string[];
      photos?: string[];
    };
  };
}

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();

  const { data, loading, refetch } = useQuery<MeData>(ME);

  const [doUpdate, { loading: saving }] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      Alert.alert('Success', 'Profile updated successfully!');
      refetch();
      router.back();
    },
    onError: (err) => Alert.alert('Error', err.message),
  });

  const [form, setForm] = useState({
    bio: '',
    age: '',
    city: '',
    interests: '',
  });

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Populate form
  useEffect(() => {
    if (data?.me?.profile) {
      const p = data.me.profile;
      setForm({
        bio: p.bio ?? '',
        age: p.age ? String(p.age) : '',
        city: p.city ?? '',
        interests: p.interests?.join(', ') ?? '',
      });
      setProfilePhoto(p.photos?.[0] || null);
    }
  }, [data]);

  // Pick Profile Picture
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please grant photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
      // TODO: Later - upload image and send URL in mutation
    }
  };

  const handleSave = () => {
    if (saving) return;

    const parsedAge = parseInt(form.age, 10);
    if (form.age && (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 100)) {
      Alert.alert('Invalid Age', 'Age must be between 18 and 100.');
      return;
    }

    const input = {
      bio: form.bio.trim(),
      city: form.city.trim(),
      interests: form.interests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      ...(form.age ? { age: parsedAge } : {}),
    };

    doUpdate({ variables: { input } });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={PINK} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={router.back}>
          <Icon name="chevron-back" size={28} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" style={{backgroundColor: '#FFF5F7'}}>
        {/* Profile Picture */}
        <View style={styles.avatarWrap}>
          <Pressable onPress={pickImage}>
            <Image
              source={{ uri: profilePhoto || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View style={styles.cameraBtn}>
              <Icon name="camera" size={20} color="#fff" />
            </View>
          </Pressable>
          <Text style={styles.avatarHint}>Tap to change profile picture</Text>
        </View>

        {/* Username (Read-only for now) */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Username</Text>
          <Text style={[styles.fieldInput, { color: '#888' }]}>
            @{data?.me?.username || 'username'}
          </Text>
        </View>

        {/* Bio */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Bio</Text>
          <TextInput
            style={[styles.fieldInput, styles.multilineInput]}
            value={form.bio}
            onChangeText={(v) => setForm((f) => ({ ...f, bio: v }))}
            placeholder="Write something about yourself..."
            multiline
            maxLength={300}
          />
          <Text style={styles.charCount}>{form.bio.length}/300</Text>
        </View>

        {/* Age */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Age</Text>
          <TextInput
            style={styles.fieldInput}
            value={form.age}
            onChangeText={(v) => setForm((f) => ({ ...f, age: v }))}
            placeholder="25"
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>

        {/* City */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>City</Text>
          <TextInput
            style={styles.fieldInput}
            value={form.city}
            onChangeText={(v) => setForm((f) => ({ ...f, city: v }))}
            placeholder="Port Harcourt"
          />
        </View>

        {/* Interests */}
        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Interests</Text>
          <TextInput
            style={styles.fieldInput}
            value={form.interests}
            onChangeText={(v) => setForm((f) => ({ ...f, interests: v }))}
            placeholder="music, travel, photography, gym"
          />
          <Text style={styles.fieldHint}>Separate with commas</Text>
        </View>

        <Pressable style={styles.saveBtnBottom} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveBtnBottomText}>
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFF5F7',
    // borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111' },
  saveBtn: {
    backgroundColor: PINK,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 99,
    minWidth: 70,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  content: { paddingBottom: 100 },

  avatarWrap: { alignItems: 'center', paddingVertical: 32 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFD6E0',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: PINK,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarHint: { fontSize: 13, color: '#999', marginTop: 8 },

  fieldWrap: { paddingHorizontal: 20, marginBottom: 24 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  fieldInput: {
    borderWidth: 0.2,
    borderColor: PINK,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffeeee',
  },
  multilineInput: { height: 110, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: '#C4C4C4', textAlign: 'right', marginTop: 4 },
  fieldHint: { fontSize: 11, color: '#C4C4C4', marginTop: 4 },

  saveBtnBottom: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: PINK,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveBtnBottomText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});