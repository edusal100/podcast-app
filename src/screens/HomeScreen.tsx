import { FlatList, Text } from "react-native";
import PodcastCard from "@/components/PodcastCard";
import { PODCASTS } from "@/data/podcast";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSize } from "@/theme";
import { fetchPodcastFeed } from "@/services/podcast";

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: colors.primary, fontSize: fontSize.display, marginBottom: 16, fontWeight: 'bold' }}>
        Podcast
      </Text>

      <FlatList
        data={PODCASTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        windowSize={10}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        columnWrapperStyle={{ gap: 20 }}
        contentContainerStyle={{ gap: 5 }}
        renderItem={({ item, index }) => (
          <PodcastCard
            podcast={item}
            index={index}
            onPressIn={() => fetchPodcastFeed(item.feedUrl)}
            onPress={() => {
              requestAnimationFrame(() => {
                navigation.navigate("PodcastDetail", { podcast: item });
              });
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}