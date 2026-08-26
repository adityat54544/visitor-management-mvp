import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { Field } from '../../components/Field';
import { changePassword } from '../../api/auth';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SettingsScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<Nav>();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === 'admin';
  const canSeeReports = isAdmin || user?.role === 'manager';

  const onSave = async () => {
    if (!current || !next) {
      Alert.alert('Fill both fields');
      return;
    }
    if (next.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      await changePassword(current, next);
      setCurrent('');
      setNext('');
      Alert.alert('Success', 'Password updated.');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const onLogout = async () => {
    Alert.alert('Sign out', 'Sign out of Visitor Management?', [
      { text: 'Cancel', style: 'cancel', onPress: () => {} },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <ScreenContainer style={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <GlassCard style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
      </GlassCard>

      <Text style={styles.section}>Change password</Text>
      <GlassCard style={styles.card}>
        <Field
          label="Current password"
          value={current}
          onChangeText={setCurrent}
          secureTextEntry
          placeholder="••••••••"
        />
        <Field
          label="New password"
          value={next}
          onChangeText={setNext}
          secureTextEntry
          placeholder="••••••••"
        />
        <GlassButton label="Update password" variant="subtle" onPress={onSave} loading={saving} />
      </GlassCard>

      {(isAdmin || canSeeReports) && (
        <>
          <Text style={styles.section}>Management</Text>
          {canSeeReports && (
            <GlassButton
              label="Visitor reports"
              variant="subtle"
              onPress={() => navigation.navigate('Reports')}
              style={{ marginBottom: 10 }}
            />
          )}
          {isAdmin && (
            <GlassButton
              label="Team & roles"
              variant="subtle"
              onPress={() => navigation.navigate('AdminUsers')}
              style={{ marginBottom: 16 }}
            />
          )}
        </>
      )}

      <GlassButton label="Sign out" variant="danger" onPress={onLogout} style={{ marginTop: 4 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 16 },
  card: { marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(59,110,165,0.12)',
  },
  label: { color: colors.subtext, fontSize: 14 },
  value: { color: colors.text, fontWeight: '600', fontSize: 14 },
  section: { fontSize: 14, fontWeight: '700', color: colors.subtext, marginBottom: 8 },
});