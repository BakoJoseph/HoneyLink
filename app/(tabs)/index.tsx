import { router } from 'expo-router';
import {
  ImageBackground,
  Pressable,
  Text,
  View,
} from "react-native";
import styles from '../../style'

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/Couples.jpg')}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.displayText}>Find Your Perfect Match Today</Text>

          <Pressable style={styles.primaryButton} onPress={() => router.push('/LoginUI')}>
            <Text style={styles.primaryButtonText}>Login</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("./signup")}
          >
            <Text style={styles.secondaryButtonText}>Signup</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}