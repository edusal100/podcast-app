import { useEffect, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { fetchPodcastFeed } from "@/services/podcast";
import { Episode } from "@/types/podcast";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import EpisodeItem from "@/components/EpisodeItem";
import MediaImage from "@/components/MediaImage";
import { colors, fontSize } from "@/theme";
import { usePlayer } from "@/context/PlayerContext";
import PodcastDetailSkeleton from "@/components/PodcastDetailSkeleton";

export default function PodcastDetailScreen({ route, navigation }: any) {
  const { podcast } = route.params;
  const { openPlayer } = usePlayer();

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await fetchPodcastFeed(podcast.feedUrl);
     requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEpisodes(data.episodes);
        setLoading(false);
      });
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <MediaImage
        uri={podcast.image}
        style={{ width: "100%", height: 300 }}
      />

      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 35,
          left: 15,
          width: 44,
          height: 44,
          borderRadius: 22,
          overflow: "hidden",
        }}
      >
        <BlurView intensity={90} tint="dark" style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="chevron-back" size={22} color="white" style={{ transform: [{ translateX: -1 }] }} />
        </BlurView>
      </Pressable>

      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.primary, fontSize: 22 }}>{podcast.title}</Text>
        <Text style={{ color: colors.muted, marginTop: 4, fontSize: fontSize.md }} numberOfLines={2} ellipsizeMode="tail">
          {podcast.author}
        </Text>
        <Text numberOfLines={3} style={{ color: colors.text, marginTop: 8 }}>
          {podcast.description}
        </Text>
      </View>

      {loading ? (
  <PodcastDetailSkeleton />
      ) : (
        <FlatList
          data={episodes}
          keyExtractor={(item) => item.id}
          removeClippedSubviews
          windowSize={4}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <EpisodeItem
              episode={item}
              index={index}
              podcastImage={podcast.image}
              onPress={() => openPlayer(item, podcast.image)}
            />
          )}
        />
)}
    </View>
  );
}