import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const SignUpScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Success! The AuthContext will automatically update the user state.
      // Navigation will automatically switch to Home screen via our conditional logic.
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 🚀</Text>
      <Text style={styles.subtitle}>Join CampusConnect</Text>

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
      <CustomInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <CustomButton
        title="Sign Up"
        onPress={handleSignUp}
        loading={loading}
        disabled={loading}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.link}>Login</Text>
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

export default SignUpScreen;