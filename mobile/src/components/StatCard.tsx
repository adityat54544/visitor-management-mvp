import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme';

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  softBg: string;
  onPress?: () => void;
  index?: number;
}

// Animated count-up number + soft pop-in card. Tap to jump to that filter.
export function StatCard({ label, value, color, softBg, onPress, index = 0 }: StatCardProps) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    setDisplay(0);
    const start = Date.now();
    const duration = 620;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value]);

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <Animated.View
        entering={ZoomIn.delay(index * 80).springify().damping(14)}
        style={[styles.card, { backgroundColor: softBg }]}
      >
        <Text style={[styles.num, { color }]}>{display}</Text>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  num: { fontSize: 28, fontWeight: '800' },
  label: { marginTop: 2, fontSize: 12, fontWeight: '600', color: '#5B6572' },
});