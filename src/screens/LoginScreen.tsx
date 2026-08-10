import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Success! AuthContext will auto-update.
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to CampusConnect</Text>

      <CustomInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <CustomButton
        title="Login"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      />

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>
          Don't have an account? <Text style={styles.link}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 32 },
  linkText: { fontSize: 14, color: '#7f8c8d', textAlign: 'center', marginTop: 8 },
  link: { color: '#3498db', fontWeight: '600' },
});

export default LoginScreen;