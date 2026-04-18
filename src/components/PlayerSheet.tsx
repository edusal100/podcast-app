import { View, Text, Pressable, useWindowDimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayerControls } from "@/hooks/useAudioPlayer";
import PlayerControls from "@/components/PlayerControls";
import ProgressBar from "@/components/ProgressBar";
import MediaImage from "@/components/MediaImage";
import { colors, fontSize, spacing } from "@/theme";
import { Episode } from "@/types/podcast";
import { BlurView } from "expo-blur";

type Props = {
  episode: Episode;
  podcastImage?: string;
  onClose: () => void;
};

const MINI_HEIGHT = 90;
const SPRING = { damping: 30, stiffness: 150, overshootClamping: true };

export default function PlayerSheet({ episode, podcastImage, onClose }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const FULL_HEIGHT = height + insets.top +20;
  const MINI_OFFSET = FULL_HEIGHT - MINI_HEIGHT;

  const translateY = useSharedValue(MINI_OFFSET);
  const prevTranslateY = useSharedValue(MINI_OFFSET);

  const { isPlaying, isLoading, position, duration, togglePlay, seek, skip } =
    useAudioPlayerControls(episode.audioUrl, episode.id);

  const image = episode.image ?? podcastImage;

  function snapToFull() {
    translateY.value = withSpring(0, SPRING);
    prevTranslateY.value = 0;
  }

  function close() {
    translateY.value = withSpring(FULL_HEIGHT, SPRING);
    setTimeout(onClose, 400);
  }

  const pan = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onBegin(() => {
      prevTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      const next = prevTranslateY.value + e.translationY;
      translateY.value = Math.max(0, Math.min(FULL_HEIGHT, next));
    })
    .onEnd(() => {
      const isMini = translateY.value > MINI_OFFSET / 2;
      if (isMini) {
        translateY.value = withSpring(MINI_OFFSET, SPRING);
        prevTranslateY.value = MINI_OFFSET;
      } else {
        translateY.value = withSpring(0, SPRING);
        prevTranslateY.value = 0;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const isMiniStyle = useAnimatedStyle(() => ({
    opacity: translateY.value > MINI_OFFSET * 0.5 ? 1 : 0,
    pointerEvents: translateY.value > MINI_OFFSET * 0.5 ? "auto" : "none",
  }));

  const isFullStyle = useAnimatedStyle(() => ({
    opacity: translateY.value < MINI_OFFSET * 0.5 ? 1 : 0,
    pointerEvents: translateY.value < MINI_OFFSET * 0.5 ? "auto" : "none",
  }));

  const topProgressStyle = useAnimatedStyle(() => ({
    opacity: translateY.value > MINI_OFFSET * 0.5 ? 1 : 0,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, { height: FULL_HEIGHT }, animatedStyle]}>

        <BlurView
          intensity={75}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.primary + "15" }]} />

        {/* progress bar pinned to top */}
        <Animated.View style={[styles.topProgress, topProgressStyle]}>
          <ProgressBar position={position} duration={duration} onSeek={seek} mini trackHeight={4} />
        </Animated.View>
 

        {/* MINI PLAYER */}
        <Animated.View style={[styles.mini, isMiniStyle]}>
          <View style={styles.miniContent}>
            <Pressable
              onPress={snapToFull}
              style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <MediaImage uri={image} style={{ width: 60, height: 60 }} borderRadius={6} />
              <Text style={styles.miniTitle} numberOfLines={1}>{episode.title}</Text>
            </Pressable>
            <Pressable onPress={togglePlay} style={styles.iconBtn}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={24} color={colors.text} />
            </Pressable>
            <Pressable onPress={close} style={styles.iconBtn}>
              <Ionicons name="close" size={24} color={colors.muted} />
            </Pressable>
          </View>

          
        </Animated.View>

        {/* FULL PLAYER */}
        <Animated.View style={[styles.full, isFullStyle]}>
          <MediaImage
            uri={image}
            sharedTag={`episode-${episode.id}`}
            style={{ width: "100%", height: 400, borderRadius: 12 }}
          />

          <View style={{ gap: 4, marginTop: spacing.md, marginBottom: 20 }}>
            <Text style={{ color: colors.primary, fontSize: fontSize.lg, fontWeight: "bold" }} numberOfLines={2}>
              {episode.title}
            </Text>
            {episode.published ? (
              <Text style={{ color: colors.muted, fontSize: fontSize.sm }}>
                {new Date(episode.published).toLocaleDateString(undefined, {
                  month: "short", day: "2-digit", year: "numeric",
                })}
              </Text>
            ) : null}
          </View>

          <ProgressBar position={position} duration={duration} onSeek={seek} trackHeight={4} />

          {episode.description ? (
            <Text
              numberOfLines={3}
              style={{ color: colors.muted, fontSize: fontSize.sm, lineHeight: 20, marginBottom: spacing.xxl, marginTop: spacing.lg }}
            >
              {episode.description.replace(/<[^>]+>/g, "")}
            </Text>
          ) : null}

          <PlayerControls
            isPlaying={isPlaying}
            isLoading={isLoading}
            onToggle={togglePlay}
            onSkipBack={() => skip(-15)}
            onSkipForward={() => skip(30)}
          />
        </Animated.View>

      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: "hidden",
  },
  mini: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: MINI_HEIGHT,
    justifyContent: "space-between",
  },
  miniContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 4
  },
  miniTitle: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
  },
  iconBtn: {
    padding: 8,
  },
  full: {
    flex: 1,
    padding: spacing.md,
    paddingTop: 60,
  },
  topProgress: {
    position: "absolute",
    top: 0,        // ← flush to top
    left: 0,       // ← flush to left
    right: 0,
    zIndex: 10,
  },
});