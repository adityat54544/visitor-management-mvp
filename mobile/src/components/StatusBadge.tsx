import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { statusColors, statusDisplay } from '../theme';

interface StatusBadgeProps {
  status: 'checked-in' | 'checked-out' | 'expected';
}

// Animated status pill — fades and morphs its background color on change.
export function StatusBadge({ status }: StatusBadgeProps) {
  const key = status === 'checked-in' ? 'checkedin' : status === 'checked-out' ? 'checkedout' : 'expected';
  const palette = statusColors[key];

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSequence(
      withTiming(1, { duration: 260 }, () => {
        'worklet';
        progress.value = withTiming(0, { duration: 240 });
      })
    );
  }, [key, progress]);

  const pulse = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.05 }],
    backgroundColor: palette.bg,
  }));

  return (
    <Animated.View style={[styles.badge, pulse]}>
      <View style={[styles.dot, { backgroundColor: palette.dot }]} />
      <Text style={[styles.label, { color: palette.fg }]}>{statusDisplay(status)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  label: { fontSize: 12, fontWeight: '700' },
});