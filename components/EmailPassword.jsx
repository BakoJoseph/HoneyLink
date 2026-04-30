import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from '../style';
import Feather from '@expo/vector-icons/Feather';

const EmailPassword = ({
  email = '',
  setEmail = () => {},
  password = '',
  setPassword = () => {},
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.formContainer}>
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Email" 
          placeholderTextColor="#666"
          style={styles.input} 
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View style={[styles.inputContainer, styles.passwordRow]}>
        <TextInput 
          placeholder="Password" 
          placeholderTextColor="#666"
          secureTextEntry={!passwordVisible}
          style={[styles.input, { flex: 1 }]} 
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => {setPasswordVisible(!passwordVisible)}}>
          { passwordVisible ? <Feather name="eye" size={24} color="#666" /> : <Feather name="eye-off" size={24} color="#666" /> }
        </TouchableOpacity>
      </View>

      {/* Forgot Password Link */}
      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EmailPassword
