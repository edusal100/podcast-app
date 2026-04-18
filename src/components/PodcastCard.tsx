import { View, Text, Pressable } from "react-native";
import { Podcast } from "@/types/podcast";
import { colors, fontSize } from "@/theme";
import MediaImage from "@/components/MediaImage";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  podcast: Podcast;
  onPress: () => void;
  onPressIn: () => void;
  index?: number;
};

export default function PodcastCard({ podcast, index = 0, onPress, onPressIn }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).duration(300).springify()} style={{ flex: 1 }}>
      <Pressable onPressIn={onPressIn} onPress={onPress} style={{ flex: 1 }}>
        <MediaImage
          uri={podcast.image}
          sharedTag={`podcast-${podcast.id}`}
          style={{ width: "100%", aspectRatio: 1 }}
          borderRadius={12}
        />
        <View style={{ marginTop: 8, marginBottom: 16 }}>
          <Text style={{ color: colors.text, fontSize: fontSize.lg }}>
            {podcast.title}
          </Text>
          <Text
            style={{ color: colors.muted, fontSize: fontSize.sm }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {podcast.author}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}