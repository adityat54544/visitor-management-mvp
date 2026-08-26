import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { GlassCard } from '../../components/GlassCard';
import { StatCard } from '../../components/StatCard';
import { fetchRecentReport, type VisitorReport } from '../../api/reports';
import { colors, radius } from '../../theme';

export function ReportsScreen() {
  const [report, setReport] = useState<VisitorReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentReport(7)
      .then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load report'));
  }, []);

  if (error) {
    return (
      <ScreenContainer style={styles.content}>
        <Text style={styles.title}>Reports</Text>
        <GlassCard><Text style={styles.muted}>{error}</Text></GlassCard>
      </ScreenContainer>
    );
  }

  if (!report) {
    return (
      <ScreenContainer style={styles.content}>
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.muted}>Loading…</Text>
      </ScreenContainer>
    );
  }

  const maxDay = Math.max(1, ...report.daily.map((d) => d.count));

  return (
    <ScreenContainer style={styles.content}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.range}>Last 7 days</Text>

      <View style={styles.statsRow}>
        <StatCard label="Total" value={report.totals.total} color={colors.primary} softBg={colors.primarySoft} index={0} />
        <StatCard label="In now" value={report.totals.checkedIn} color={colors.success} softBg="#DFF0E7" index={1} />
      </View>
      <View style={[styles.statsRow, { marginTop: -4 }]}>
        <StatCard label="Checked-out" value={report.totals.checkedOut} color={colors.muted} softBg="#E9ECF1" index={2} />
        <StatCard label="Expected" value={report.totals.expected} color={colors.warning} softBg="#F6EAD6" index={3} />
      </View>

      <GlassCard index={4}>
        <Text style={styles.h2}>Check-ins per day</Text>
        <View style={styles.chart}>
          {report.daily.map((d) => (
            <View key={d._id} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View style={[styles.bar, { height: (d.count / maxDay) * 90, opacity: d.count ? 1 : 0.25 }]} />
              </View>
              <Text style={styles.barCount}>{d.count}</Text>
              <Text style={styles.day}>{d._id.slice(5)}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard index={5}>
        <Text style={styles.h2}>Top purposes</Text>
        {report.byPurpose.length === 0 ? (
          <Text style={styles.muted}>No data yet.</Text>
        ) : (
          report.byPurpose.slice(0, 6).map((p) => (
            <View key={p._id ?? 'none'} style={styles.purposeRow}>
              <Text style={styles.purposeName}>{p._id || 'Unspecified'}</Text>
              <Text style={styles.purposeCount}>{p.count}</Text>
            </View>
          ))
        )}
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  range: { color: colors.subtext, marginBottom: 16, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  h2: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  barCol: { flex: 1, alignItems: 'center' },
  barTrack: { height: 92, justifyContent: 'flex-end', width: '100%', alignItems: 'center' },
  bar: { width: '62%', backgroundColor: colors.primary, borderRadius: radius.sm },
  barCount: { fontSize: 11, fontWeight: '700', color: colors.text, marginTop: 4 },
  day: { fontSize: 10, color: colors.subtle },
  purposeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  purposeName: { color: colors.text, fontSize: 14, fontWeight: '600' },
  purposeCount: { color: colors.primary, fontWeight: '800' },
  muted: { color: colors.subtle },
});
