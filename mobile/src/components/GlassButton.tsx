import React from 'react';
import { Pressable, StyleSheet, Text, ActivityIndicator, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, radius } from '../theme';

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'subtle';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

const Accent = {
  primary: { tint: 'light' as const, bg: 'rgba(59,110,165,0.82)', fg: '#FFFFFF', border: 'rgba(255,255,255,0.35)' },
  success: { tint: 'light' as const, bg: 'rgba(46,158,107,0.84)', fg: '#FFFFFF', border: 'rgba(255,255,255,0.4)' },
  danger: { tint: 'light' as const, bg: 'rgba(192,87,79,0.84)', fg: '#FFFFFF', border: 'rgba(255,255,255,0.4)' },
  subtle: { tint: 'light' as const, bg: 'rgba(255,255,255,0.6)', fg: colors.primary, border: 'rgba(59,110,165,0.25)' },
} as const;

// Frosted fallback used when BlurView isn't desired on a given platform.
const Frosted = ({ bg, border, children }: { bg: string; border: string; children: React.ReactNode }) => (
  <Animated.View style={[styles.frosted, { backgroundColor: bg, borderColor: border }]}>
    {children}
  </Animated.View>
);

export function GlassButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
}: GlassButtonProps) {
  const scale = useSharedValue(1);
  const shadowY = useSharedValue(6);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOffset: { width: 0, height: shadowY.value },
  }));

  const acc = Accent[variant];

  return (
    <Animated.View style={[styles.wrap, animatedStyle, style]}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 12, stiffness: 300 });
          shadowY.value = withSpring(2);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12, stiffness: 260 });
          shadowY.value = withSpring(6);
        }}
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.92 : 1 }]}
      >
        <BlurView
          intensity={variant === 'subtle' ? 18 : 22}
          tint={acc.tint}
          style={[styles.blur, { backgroundColor: acc.bg, borderColor: acc.border }]}
        >
          {icon}
          {loading ? (
            <ActivityIndicator color={acc.fg} />
          ) : (
            <Text style={[styles.label, { color: acc.fg }]}>{label}</Text>
          )}
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.pill,
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  pressable: { borderRadius: radius.pill },
  blur: {
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 22,
    height: 52,
  },
  frosted: {
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 22,
    height: 52,
  },
  label: { fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
});