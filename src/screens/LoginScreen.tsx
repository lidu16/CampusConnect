import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { theme } from '../theme';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      } else if (error.message) {
        message = error.message;
      }
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.brand}>CampusConnect</Text>
          <Text style={styles.tagline}>Your magical gateway to campus life</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access announcements, events & more</Text>

          <CustomInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
          />
          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          />

          <TouchableOpacity
            style={styles.signUpLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.linkText}>
              New here? <Text style={styles.link}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    marginBottom: 12,
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  signUpLink: {
    marginTop: 4,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;
