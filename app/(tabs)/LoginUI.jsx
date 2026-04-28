import { StatusBar } from 'expo-status-bar';
import { Keyboard, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import styles from '../../style';
import HeaderSection from '../../components/HeaderSection';
import SocialLogin from '../../components/SocialLogin';
import EmailPassword from '../../components/EmailPassword';
import { LOGIN } from '../../scripts/graphql';
import { saveToken } from '../../scripts/auth';

const getAuthErrorMessage = (err) => {
  if (err?.message?.includes('Network request failed')) {
    return 'Cannot reach the server right now. Check that the backend is running and EXPO_PUBLIC_GRAPHQL_URL is correct.';
  }

  return err?.message || 'Something went wrong. Please try again.';
};

const LoginUI = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showPopup = (type, title, message) => setPopup({ visible: true, type, title, message });
  const closePopup = () => setPopup((current) => ({ ...current, visible: false }));

  const [doLogin, { loading }] = useMutation(LOGIN, {
    onCompleted: async ({ login }) => {
      await saveToken(login.token);
      showPopup('success', 'Login successful', 'Welcome back!');
    },
    onError: (err) => {
      showPopup('error', 'Login failed', getAuthErrorMessage(err));
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      showPopup('error', 'Missing information', 'Enter your email and password to continue.');
      return;
    }

    doLogin({ variables: { email, password } });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <HeaderSection />
        <EmailPassword
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
        <SocialLogin onLogin={handleLogin} loading={loading} />

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
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginUI;
