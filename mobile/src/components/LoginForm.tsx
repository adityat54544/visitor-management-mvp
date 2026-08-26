import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Field } from './Field';
import { GlassButton } from './GlassButton';
import { colors } from '../theme';

interface LoginFormProps {
  email: string;
  password: string;
  onEmail: (v: string) => void;
  onPassword: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export function LoginForm({
  email,
  password,
  onEmail,
  onPassword,
  onSubmit,
  loading,
  error,
}: LoginFormProps) {
  return (
    <>
      <Field
        label="Email"
        value={email}
        onChangeText={onEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <Field
        label="Password"
        value={password}
        onChangeText={onPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <GlassButton label="Sign in" onPress={onSubmit} loading={loading} style={styles.btn} />
    </>
  );
}

const styles = StyleSheet.create({
  btn: { marginTop: 6 },
  error: { color: colors.danger, fontSize: 13, fontWeight: '600', marginBottom: 10 },
});