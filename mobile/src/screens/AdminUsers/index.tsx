import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer, EntranceItem } from '../../components/ScreenContainer';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { Field } from '../../components/Field';
import { createUser, fetchUsers, updateUserRole } from '../../api/users';
import type { User } from '../../api/types';
import { colors } from '../../theme';

const ROLES: User['role'][] = ['admin', 'manager', 'receptionist', 'host'];

/** Admin-only user management: view staff, create users, change roles. */
export function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('receptionist');
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    fetchUsers().then(setUsers).catch((e) =>
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to load users')
    );
  }, []);

  useEffect(load, [load]);

  const submit = async () => {
    if (!name.trim() || !email.trim() || password.length < 6) {
      Alert.alert('Missing info', 'Name and email are required; password needs 6+ characters.');
      return;
    }
    setCreating(true);
    try {
      await createUser({ name: name.trim(), email: email.trim(), password, role });
      setName(''); setEmail(''); setPassword('');
      load();
      Alert.alert('Created', `${name.trim()} can now sign in as ${role}.`);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  const changeRole = async (u: User, r: User['role']) => {
    try {
      await updateUserRole(u.id, r);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: r } : x)));
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Role change failed');
    }
  };

  return (
    <ScreenContainer style={styles.content}>
      <Text style={styles.title}>Team & roles</Text>

      <GlassCard style={styles.form}>
        <Text style={styles.h2}>Add a team member</Text>
        <Field label="Full name" value={name} onChangeText={setName} placeholder="e.g. Priya Sharma" />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="name@company.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Field label="Password" value={password} onChangeText={setPassword} placeholder="6+ characters" secureTextEntry />
        <View style={styles.rolesRow}>
          {ROLES.map((r) => (
            <Text
              key={r}
              onPress={() => setRole(r)}
              style={[styles.roleChip, role === r && styles.roleChipActive]}
            >
              {r}
            </Text>
          ))}
        </View>
        <GlassButton label="Add member" variant="primary" loading={creating} onPress={submit} />
      </GlassCard>

      {users.map((u, i) => (
        <EntranceItem key={u.id} index={i}>
          <GlassCard style={styles.userCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{u.name}</Text>
              <Text style={styles.userEmail}>{u.email}</Text>
            </View>
            <View style={styles.rolesRowSm}>
              {ROLES.map((r) => (
                <Text
                  key={r}
                  onPress={() => changeRole(u, r)}
                  style={[styles.roleChipSm, u.role === r && styles.roleChipActive]}
                >
                  {r[0].toUpperCase()}
                </Text>
              ))}
            </View>
          </GlassCard>
        </EntranceItem>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 16 },
  form: { marginBottom: 18 },
  h2: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10 },
  rolesRow: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  rolesRowSm: { flexDirection: 'row', gap: 6 },
  roleChip: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.subtext,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
    textTransform: 'capitalize',
  },
  roleChipSm: { width: 30, height: 30, lineHeight: 28, textAlign: 'center', borderRadius: 15, overflow: 'hidden', fontSize: 13, fontWeight: '800', color: colors.subtext, borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: 'rgba(255,255,255,0.7)' },
  roleChipActive: { backgroundColor: colors.primarySoft, color: colors.primary, borderColor: colors.primary },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  userName: { fontWeight: '800', color: colors.text, fontSize: 15 },
  userEmail: { color: colors.subtext, fontSize: 13, marginTop: 2 },
});
