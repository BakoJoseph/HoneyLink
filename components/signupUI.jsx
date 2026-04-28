import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../style';
import { SIGNUP } from '../scripts/graphql';
import { saveToken } from '../scripts/auth';

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [popup, setPopup] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  const [signUpUser, { loading }] = useMutation(SIGNUP, {
    onCompleted: async ({ signup }) => {
      await saveToken(signup.token);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/swipe');
    },
    onError: (err) => Alert.alert('Signup Failed', err.message),
  });

  const handleSignUp = () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    signUpUser({ variables: { email, password, username } });
  };

  const closePopup = () => {
    setPopup({ visible: false, type: 'success', title: '', message: '' });
  };

  return (
    <>
      <SafeAreaView style={styles.signUpContainer} edges={['top', 'bottom']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.signUpHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.signUpBackArrow}>
              <Entypo name="chevron-left" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle2}>Sign Up</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.signUpTitle}>Create an account</Text>
            <Text style={styles.signUpSubtitle}>Create an account to continue</Text>

            <View style={styles.signUpForm}>
              <TextInput
                placeholder="User Name"
                style={styles.signUpInput}
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                placeholder="Email"
                style={styles.signUpInput}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <View style={styles.signUpPasswordContainer}>
                <TextInput
                  placeholder="Password"
                  style={[styles.signUpInput, styles.signUpPasswordInput]}
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.signUpPasswordToggle}
                  onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Feather name={passwordVisible ? 'eye' : 'eye-off'} size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <View style={styles.signUpPasswordContainer}>
                <TextInput
                  placeholder="Confirm Password"
                  style={[styles.signUpInput, styles.signUpPasswordInput]}
                  secureTextEntry={!passwordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.signUpPasswordToggle}
                  onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Feather name={passwordVisible ? 'eye' : 'eye-off'} size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
              <Text style={styles.signUpButtonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
            </TouchableOpacity>


            <View style={styles.signUpFooter}>
              <Text style={styles.signUpFooterText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.replace('/LoginUI')}>
                <Text style={styles.signUpFooterLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal
          transparent
          animationType="fade"
          visible={popup.visible}
          onRequestClose={closePopup}>
          <View style={styles.popupOverlay}>
            <View style={styles.popupCard}>
              <Text
                style={[
                  styles.popupTitle,
                  popup.type === 'error' ? styles.popupTitleError : styles.popupTitleSuccess,
                ]}>
                {popup.title}
              </Text>
              <Text style={styles.popupMessage}>{popup.message}</Text>
              <TouchableOpacity
                style={[
                  styles.popupButton,
                  popup.type === 'error' ? styles.popupButtonError : styles.popupButtonSuccess,
                ]}
                onPress={closePopup}>
                <Text style={styles.popupButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView >
    </>
  );
};

export default SignUp;
