import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../style';
import { SIGNUP } from '../../scripts/graphql';
import { saveToken } from '../../scripts/auth';

const getAuthErrorMessage = (err) => {
  if (err?.message?.includes('Network request failed')) {
    return 'Cannot reach the server right now. Check that the backend is running and EXPO_PUBLIC_GRAPHQL_URL is correct.';
  }

  return err?.message || 'Something went wrong. Please try again.';
};

const SignUpScreen = () => {
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

  const showPopup = (type, title, message) => {
    setPopup({
      visible: true,
      type,
      title,
      message,
    });
  };

  const closePopup = () => {
    setPopup((currentPopup) => ({ ...currentPopup, visible: false }));
  };

  const [signUpUser, { loading }] = useMutation(SIGNUP, {
    onCompleted: async ({ signup }) => {
      await saveToken(signup.token);
      showPopup('success', 'Account created', 'Your account has been created successfully.');
    },
    onError: (err) => {
      showPopup('error', 'Sign up failed', getAuthErrorMessage(err));
    },
  });

  const handleSignUp = () => {
    if (!username || !email || !password || !confirmPassword) {
      showPopup('error', 'Missing information', 'Please fill in all fields before signing up.');
      return;
    }

    if (password !== confirmPassword) {
      showPopup('error', 'Password mismatch', 'Password and confirm password must match.');
      return;
    }

    signUpUser({ variables: { email, password, username } });
  };

  return (
    <SafeAreaView style={styles.signUpContainer} edges={['top', 'bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
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
                  {passwordVisible ? (
                    <Feather name="eye" size={24} color="#666" />
                  ) : (
                    <Feather name="eye-off" size={24} color="#666" />
                  )}
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
                  {passwordVisible ? (
                    <Feather name="eye" size={24} color="#666" />
                  ) : (
                    <Feather name="eye-off" size={24} color="#666" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.authButtonDisabled]}
              onPress={handleSignUp}
              disabled={loading}>
              <Text style={styles.signUpButtonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <View style={styles.signUpTermsContainer}>
              <Text style={styles.signUpTermsText}>
                By signing up, you agree to our <Text style={styles.signUpTermsLink}>Terms</Text>{' '}
                and <Text style={styles.signUpTermsLink}>Conditions</Text>.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.signUpFooter}>
            <Text style={styles.signUpFooterText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.signUpFooterLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <Modal transparent animationType="fade" visible={popup.visible} onRequestClose={closePopup}>
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
              onPress={() => {
                const isSuccess = popup.type === 'success';
                closePopup();

                if (isSuccess) {
                  router.replace('/homepage');
                }
              }}>
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SignUpScreen;
