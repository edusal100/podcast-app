// components/PodcastDetailSkeleton.tsx
import { View, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, cancelAnimation } from "react-native-reanimated";
import { useEffect } from "react";
import { colors } from "@/theme";

function SkeletonItem() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800 }),
      -1,
      true
    );
    return () => cancelAnimation(opacity);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.item, animStyle]}>
      {/* image placeholder */}
      <View style={[styles.image, { backgroundColor: colors.surface }]} />

      {/* text lines */}
      <View style={styles.textBlock}>
        <View style={[styles.line, { width: "85%", backgroundColor: colors.surface }]} />
        <View style={[styles.line, { width: "55%", marginTop: 8, backgroundColor: colors.surface }]} />
        <View style={[styles.line, { width: "40%", marginTop: 8, backgroundColor: colors.surface }]} />
      </View>
    </Animated.View>
  );
}

export default function PodcastDetailSkeleton() {
  return (
    <View>
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  textBlock: {
    flex: 1,
  },
  line: {
    height: 12,
    borderRadius: 6
  },
});