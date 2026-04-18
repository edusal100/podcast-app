import { View, Text, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { colors } from "@/theme";

type Props = {
  position: number;
  duration: number;
  onSeek: (millis: number) => void;
  mini?: boolean;
  trackHeight?: number;
};

function format(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function ProgressBar({
  position,
  duration,
  onSeek,
  mini = false,
  trackHeight = 3,
}: Props) {
  const trackWidth = useSharedValue(0);
  const isScrubbing = useSharedValue(false);
  const scrubPosition = useSharedValue(0);

  const progress = duration > 0 ? position / duration : 0;

  const fillStyle = useAnimatedStyle(() => ({
    width: `${(isScrubbing.value ? scrubPosition.value : progress) * 100}%`,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    left: `${(isScrubbing.value ? scrubPosition.value : progress) * 100}%`,
  }));

  const pan = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => {
      isScrubbing.value = true;
      scrubPosition.value = Math.max(0, Math.min(1, e.x / trackWidth.value));
    })
    .onUpdate((e) => {
      scrubPosition.value = Math.max(0, Math.min(1, e.x / trackWidth.value));
    })
    .onEnd(() => {
      const millis = scrubPosition.value * duration;
      isScrubbing.value = false;
      runOnJS(onSeek)(millis);
    });

  return (
    <View style={mini ? styles.miniContainer : styles.container}>
      <GestureDetector gesture={pan}>
        <View
          style={[styles.track, { height: trackHeight }]}
          onLayout={(e) => {
            trackWidth.value = e.nativeEvent.layout.width;
          }}
        >
          {/* filled track */}
          <Animated.View
            style={[styles.fill, fillStyle, { height: trackHeight }]}
          />
          {/* thumb — hidden in mini */}
          {!mini && (
            <Animated.View style={[styles.thumb, thumbStyle]} />
          )}
        </View>
      </GestureDetector>

      {/* time labels — hidden in mini */}
      {!mini && (
        <View style={styles.labels}>
          <Text style={styles.label}>{format(position)}</Text>
          <Text style={styles.label}>{format(duration)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 8,
  },
  miniContainer: {
    width: "100%",
  },
  track: {
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 99,
    overflow: "visible",
    justifyContent: "center",
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: 99,
  },
  thumb: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    marginLeft: -7,
    top: "50%",
    marginTop: -7,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
  },
});