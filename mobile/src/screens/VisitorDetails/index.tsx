import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { GlassButton } from '../../components/GlassButton';
import { GlassCard } from '../../components/GlassCard';
import { StatusBadge } from '../../components/StatusBadge';
import { formatTime } from '../../components/VisitorCard';
import { checkInVisitor, checkOutVisitor, fetchVisitor } from '../../api/visitors';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'VisitorDetails'>;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
  );
}

export function VisitorDetailsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const [visitor, setVisitor] = useState(route.params.visitor);
  const [busy, setBusy] = useState(false);

  const onCheckIn = async () => {
    setBusy(true);
    try {
      const updated = await checkInVisitor(visitor._id);
      setVisitor(updated);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Check-in failed');
    } finally {
      setBusy(false);
    }
  };

  const onCheckOut = async () => {
    setBusy(true);
    try {
      const updated = await checkOutVisitor(visitor._id);
      setVisitor(updated);
      Alert.alert('Checked out', `${updated.name} has been checked out.`);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Check-out failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenContainer style={styles.content}>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {visitor.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{visitor.name}</Text>
          <Text style={styles.company}>{visitor.company || 'Visitor'}</Text>
        </View>
        <StatusBadge status={visitor.status} />
      </View>

      <GlassCard style={styles.card}>
        <Row label="Phone" value={visitor.phone} />
        <Row label="Company" value={visitor.company} />
        <Row label="Person to meet" value={visitor.personToMeet} />
        <Row label="Purpose" value={visitor.purpose} />
        <Row label="Expected" value={formatTime(visitor.expectedTime)} />
        <Row label="Checked-in" value={formatTime(visitor.checkInTime)} />
        <Row label="Checked-out" value={formatTime(visitor.checkOutTime)} />
      </GlassCard>

      <View style={styles.actions}>
        {visitor.status === 'expected' ? (
          <GlassButton label="Check in Now" variant="success" onPress={onCheckIn} loading={busy} />
        ) : null}
        {visitor.status === 'checked-in' ? (
          <GlassButton label="Check out" variant="primary" onPress={onCheckOut} loading={busy} />
        ) : null}
        {visitor.status === 'checked-out' ? (
          <GlassCard chrome style={styles.doneCard}>
            <Text style={styles.doneText}>✓ This visitor has left.</Text>
          </GlassCard>
        ) : null}
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.primary, fontWeight: '800', fontSize: 18 },
  name: { fontSize: 20, fontWeight: '800', color: colors.text },
  company: { marginTop: 2, fontSize: 14, color: colors.subtext },
  card: { marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(59,110,165,0.12)',
  },
  rowLabel: { color: colors.subtext, fontSize: 14 },
  rowValue: { color: colors.text, fontWeight: '600', fontSize: 14, flexShrink: 1, textAlign: 'right', marginLeft: 12 },
  actions: { gap: 10 },
  doneCard: { alignItems: 'center', paddingVertical: 18 },
  doneText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  back: { textAlign: 'center', color: colors.primary, fontWeight: '700', marginTop: 8, fontSize: 15 },
});