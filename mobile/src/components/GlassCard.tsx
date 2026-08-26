import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, radius, shadow } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  index?: number;
  chrome?: boolean;
}

// Soft glass card — white frosted surface with a hairline border + soft shadow.
export function GlassCard({ children, style, index = 0, chrome = false }: GlassCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70).springify().damping(15)}
      style={[
        styles.card,
        chrome
          ? { backgroundColor: colors.glassDark, borderColor: 'rgba(255,255,255,0.18)' }
          : { backgroundColor: 'rgba(255,255,255,0.72)', borderColor: colors.glassBorder },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 16,
    ...shadow.card,
  },
});