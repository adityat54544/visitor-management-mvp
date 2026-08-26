import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, EntranceItem } from '../../components/ScreenContainer';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../api/notifications';
import { fetchVisitor } from '../../api/visitors';
import type { Notification } from '../../api/types';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationsScreen() {
  const navigation = useNavigation<Nav>();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (spinner = false) => {
    if (spinner) setLoading(true);
    try {
      setItems(await fetchNotifications());
    } catch {
      /* keep previous list on refresh failure */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(true);
  }, [load]);

  const unread = items.filter((n) => !n.read).length;

  const openRelated = async (n: Notification) => {
    if (!n.read) {
      // optimistic read
      setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
      try {
        await markNotificationRead(n._id);
      } catch {}
    }
    if (n.visitorId) {
      const id = typeof n.visitorId === 'string' ? n.visitorId : n.visitorId._id;
      try {
        navigation.navigate('VisitorDetails', { visitor: await fetchVisitor(id) });
      } catch {
        /* visitor may have been deleted */
      }
    }
  };

  return (
    <ScreenContainer
      style={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />
      }
    >
      <View style={styles.head}>
        <Text style={styles.title}>Notifications</Text>
        {unread > 0 && (
          <View style={styles.unreadPill}>
            <Text style={styles.unreadText}>{unread} new</Text>
          </View>
        )}
      </View>

      {unread > 0 && (
        <GlassButton label="Mark all read" variant="subtle" onPress={() => markAllNotificationsRead().then(() => load())} />
      )}

      {loading && !items.length ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : items.length === 0 ? (
        <GlassCard><Text style={styles.muted}>No notifications yet.</Text></GlassCard>
      ) : (
        items.map((n, i) => (
          <EntranceItem key={n._id} index={i}>
            <Pressable onPress={() => openRelated(n)}>
              <GlassCard style={[styles.item, !n.read && styles.unread]}>
                <View style={styles.row}>
                  {!n.read && <View style={styles.dot} />}
                  <Text style={styles.nTitle}>{n.title}</Text>
                  <Text style={styles.time}>{timeAgo(n.createdAt)}</Text>
                </View>
                <Text style={styles.msg}>{n.body}</Text>
              </GlassCard>
            </Pressable>
          </EntranceItem>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  unreadPill: {
    backgroundColor: colors.danger,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  unreadText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  item: { marginBottom: 10 },
  unread: { borderLeftWidth: 4, borderLeftColor: colors.primary },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  nTitle: { flex: 1, fontWeight: '700', color: colors.text, fontSize: 15 },
  time: { color: colors.subtle, fontSize: 12 },
  msg: { marginTop: 6, color: colors.subtext, fontSize: 14, lineHeight: 19 },
  muted: { color: colors.subtle },
});
