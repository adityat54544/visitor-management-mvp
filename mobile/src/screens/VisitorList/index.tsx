import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation, useRoute, type CompositeNavigationProp, type RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { GlassButton } from '../../components/GlassButton';
import { VisitorCard } from '../../components/VisitorCard';
import { fetchVisitors } from '../../api/visitors';
import type { Visitor, VisitorStatus } from '../../api/types';
import { colors, statusColors } from '../../theme';
import type { RootStackParamList, TabParamList } from '../../navigation/types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'VisitorsTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const FILTERS: Array<{ key: VisitorStatus | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'checked-in', label: 'Checked-in' },
  { key: 'expected', label: 'Expected' },
  { key: 'checked-out', label: 'Checked-out' },
];

const filterStyle: Record<string, string> = {
  'checked-in': statusColors.checkedin.bg,
  expected: statusColors.expected.bg,
  'checked-out': statusColors.checkedout.bg,
};

export function VisitorListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<TabParamList, 'VisitorsTab'>>();
  const initial = (route.params?.initialStatus as VisitorStatus | undefined) || 'all';

  const [filter, setFilter] = useState<VisitorStatus | 'all'>(initial);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(
    async (spinner = false) => {
      if (spinner) setLoading(true);
      try {
        const params: { search?: string; status?: VisitorStatus } = {};
        if (debounced.trim()) params.search = debounced.trim();
        if (filter !== 'all') params.status = filter;
        const list = await fetchVisitors(params);
        setVisitors(list);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [debounced, filter]
  );

  useEffect(() => {
    load(true);
  }, [load, filter, debounced]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  return (
    <ScreenContainer
      style={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <Text style={styles.title}>Visitors</Text>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.search}
          placeholder="Search by name, company or phone…"
          placeholderTextColor={colors.subtle}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const bg = f.key === 'all' ? 'rgba(255,255,255,0.6)' : filterStyle[f.key];
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, active && { backgroundColor: bg }]}
            >
              <Text style={[styles.chipText, active && { color: colors.primary, fontWeight: '800' }]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error && !loading ? <Text style={styles.error}>{error}</Text> : null}

      {loading && !visitors.length ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : visitors.length === 0 ? (
        <Text style={styles.muted}>No visitors match.</Text>
      ) : (
        visitors.map((v) => (
          <VisitorCard
            key={v._id}
            visitor={v}
            onPress={() => navigation.navigate('VisitorDetails', { visitor: v })}
          />
        ))
      )}

      <GlassButton
        label="+ Register new"
        variant="primary"
        onPress={() => navigation.navigate('RegisterTab')}
        style={{ marginTop: 8 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 14 },
  searchBox: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(59,110,165,0.16)',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  search: { paddingVertical: 13, fontSize: 15, color: colors.text },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.subtext },
  error: { color: colors.danger, marginBottom: 10, fontWeight: '600' },
  muted: { color: colors.subtle, marginTop: 8 },
});