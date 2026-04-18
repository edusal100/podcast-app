import { View, Text, Pressable } from "react-native";
import { Episode } from "@/types/podcast";
import { colors, fontSize } from "@/theme";
import MediaImage from "@/components/MediaImage";
import Animated, { FadeInDown } from "react-native-reanimated";
import { getProgress } from "@/services/progressDb";

type Props = {
  episode: Episode;
  onPress: () => void;
  index?: number;
  podcastImage?: string;
};

// converts "1880" or 1880 → "31:20"
function formatDuration(seconds?: number | null) {
  if (!seconds && seconds !== 0) return "";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// formats pubDate → "Apr 15, 2026"
function formatDate(date?: string) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function EpisodeItem({ episode, onPress, index = 0, podcastImage }: Props) {
  const image = episode.image ?? podcastImage;
  const savedPosition = getProgress(episode.id);  // ← read from db
  const duration = episode.duration ? episode.duration * 1000 : 0;
  const progress = duration > 0 ? savedPosition / duration : 0;  // ← 0 to 1

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(300).springify()}>
      <Pressable
        onPress={onPress}
        style={{
          padding: 16,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <MediaImage
          sharedTag={`episode-${episode.id}`}
          uri={image}
          style={{ width: 80, height: 80 }}
          borderRadius={6}
        />

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={2}
            style={{
              color: colors.text,
              fontSize: fontSize.lg
            }}
          >
            {episode.title}
          </Text>

          <Text style={{ color: colors.muted, fontSize: fontSize.md, marginTop: 4 }}>
            {formatDuration(episode.duration)} • {formatDate(episode.published)}
          </Text>

          {/* progress bar — only show if started */}
          {progress > 0 && (
            <View style={{ marginTop: 8, height: 3, backgroundColor: "#333", borderRadius: 99 }}>
              <View
                style={{
                  height: 3,
                  width: `${Math.min(progress * 100, 100)}%`,
                  backgroundColor: colors.primary,
                  borderRadius: 99,
                }}
              />
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}