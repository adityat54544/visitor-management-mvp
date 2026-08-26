import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LoginForm } from '../../components/LoginForm';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@visitor.app');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.deco} />
      <View style={styles.container}>
        <BlurView intensity={40} tint="light" style={styles.glass} />
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>V</Text>
          </View>
          <Text style={styles.title}>Visitor Management</Text>
          <Text style={styles.subtitle}>Secure, simple front-desk check-in</Text>
        </View>

        <LoginForm
          email={email}
          password={password}
          onEmail={setEmail}
          onPassword={setPassword}
          onSubmit={onSubmit}
          loading={loading}
          error={error}
        />

        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Demo access: <Text style={styles.hintBold}>admin@visitor.app</Text> /{' '}
            <Text style={styles.hintBold}>admin123</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  deco: {
    position: 'absolute',
    top: -120,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primarySoft,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  glass: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: { alignItems: 'center', marginBottom: 28 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  logoText: { color: '#fff', fontSize: 30, fontWeight: '900' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { marginTop: 6, fontSize: 14, color: colors.subtext },
  hint: {
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  hintText: { fontSize: 12, color: colors.subtext, textAlign: 'center' },
  hintBold: { fontWeight: '700', color: colors.primary },
});