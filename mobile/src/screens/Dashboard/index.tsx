import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation, type CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, EntranceItem, FadeGroup } from '../../components/ScreenContainer';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { StatCard } from '../../components/StatCard';
import { VisitorCard } from '../../components/VisitorCard';
import { fetchToday } from '../../api/visitors';
import type { TodayResponse } from '../../api/types';
import { colors } from '../../theme';
import type { RootStackParamList, TabParamList } from '../../navigation/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'DashboardTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const [data, setData] = useState<TodayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const d = await fetchToday();
      setData(d);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(true);
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const openRegister = () => navigation.navigate('RegisterTab');
  const openList = (status?: string) => navigation.navigate('VisitorsTab', { initialStatus: status });
  const openDetails = (visitorId: string) => {
    const v = data?.visitors.find((x) => x._id === visitorId);
    if (v) navigation.navigate('VisitorDetails', { visitor: v });
  };

  const today = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const counts = data?.counts ?? { checkedIn: 0, checkedOut: 0, expected: 0 };

  return (
    <ScreenContainer
      scroll
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      style={styles.content}
    >
      <FadeGroup>
        <Text style={styles.greeting}>Good day</Text>
        <Text style={styles.date}>{today}</Text>
      </FadeGroup>

      {/* Stats */}
      <View style={styles.stats}>
        <StatCard
          index={0}
          label="Checked-in"
          value={counts.checkedIn}
          color={colors.success}
          softBg={statusBg('checkedin')}
          onPress={() => openList('checked-in')}
        />
        <StatCard
          index={1}
          label="Checked-out"
          value={counts.checkedOut}
          color={colors.muted}
          softBg={statusBg('checkedout')}
          onPress={() => openList('checked-out')}
        />
        <StatCard
          index={2}
          label="Expected"
          value={counts.expected}
          color={colors.warning}
          softBg={statusBg('expected')}
          onPress={() => openList('expected')}
        />
      </View>

      {/* Quick actions */}
      <View style={styles.quickRow}>
        <GlassButton
          label="Register"
          onPress={openRegister}
          icon={<Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>+</Text>}
          style={styles.quickBtn}
        />
        <GlassButton
          label="Scan badge"
          variant="success"
          onPress={() => navigation.navigate('QrCheckin')}
          style={styles.quickBtn}
        />
      </View>

      {/* Error banner */}
      {error && !loading ? (
        <GlassCard style={styles.errorCard}>
          <Text style={styles.errorText}>{error} — pull to refresh</Text>
        </GlassCard>
      ) : null}

      {/* Today's visitors */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Today's visitors</Text>
        <Pressable onPress={() => openList()}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      {loading && !data ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : data && data.visitors.length > 0 ? (
        data.visitors.slice(0, 6).map((v, i) => (
          <EntranceItem key={v._id} index={i}>
            <VisitorCard visitor={v} onPress={() => openDetails(v._id)} />
          </EntranceItem>
        ))
      ) : (
        <Text style={styles.muted}>No visitors today yet.</Text>
      )}
    </ScreenContainer>
  );
}

// small helper for soft background colors
function statusBg(key: 'checkedin' | 'checkedout' | 'expected'): string {
  return key === 'checkedin' ? '#DFF0E7' : key === 'checkedout' ? '#E9ECF1' : '#F6EAD6';
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  greeting: { fontSize: 14, color: colors.subtext, fontWeight: '600' },
  date: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 2, marginBottom: 18 },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  quickBtn: { flex: 1, height: 52 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  seeAll: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  errorCard: { backgroundColor: '#FBE9E7', borderColor: '#F4C7C2' },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '600' },
  muted: { color: colors.subtle, marginTop: 8 },
});