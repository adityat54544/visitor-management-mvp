import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../theme';
import { StatusBadge } from './StatusBadge';
import type { Visitor } from '../api/types';

interface VisitorCardProps {
  visitor: Visitor;
  onPress?: () => void;
  index?: number;
}

export function formatTime(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function VisitorCard({ visitor, onPress, index = 0 }: VisitorCardProps) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const primary = visitor.status === 'checked-out' ? visitor.checkOutTime : visitor.checkInTime;

  return (
    <Animated.View
      entering={undefined}
      style={style}
    >
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.97, { damping: 15 }))}
        onPressOut={() => (scale.value = withSpring(1, { damping: 15 }))}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
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
        <View style={styles.mid}>
          <Text style={styles.name} numberOfLines={1}>
            {visitor.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {visitor.company || 'Visitor'} · {visitor.personToMeet || '—'} · {formatTime(primary)}
          </Text>
        </View>
        <StatusBadge status={visitor.status} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: { opacity: 0.92 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: colors.primary, fontWeight: '800', fontSize: 14 },
  mid: { flex: 1, marginRight: 8 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  meta: { marginTop: 2, fontSize: 12, color: colors.subtext },
});