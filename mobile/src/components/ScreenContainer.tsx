import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle, type RefreshControlProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { colors } from '../theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scroll?: boolean;
  scrollRef?: unknown;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export function ScreenContainer({
  children,
  style,
  scroll = true,
  scrollRef,
  refreshControl,
}: ScreenContainerProps) {
  if (scroll) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
        <Animated.ScrollView
          ref={scrollRef as never}
          style={styles.scroll}
          contentContainerStyle={[styles.content, style]}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          {children}
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={[styles.flex, style]}>{children}</View>
    </SafeAreaView>
  );
}

// Gentle, staggered entrance for a list of items.
export function EntranceItem({
  index = 0,
  children,
}: {
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(
        80 + Math.min(index, 6) * 60
      ).springify().damping(16).stiffness(120)}
    >
      {children}
    </Animated.View>
  );
}

export function FadeGroup({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Animated.View entering={FadeIn.delay(delay).duration(340)}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
});