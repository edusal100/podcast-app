import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import HomeScreen from "@/screens/HomeScreen";
import PodcastDetailScreen from "@/screens/PodcastDetailScreen";
import PlayerSheet from "@/components/PlayerSheet";
import { Episode } from "@/types/podcast";
import { colors } from "@/theme";
import { useState } from "react";
import { PlayerContext } from "@/context/PlayerContext";
import { SafeAreaProvider } from "react-native-safe-area-context";


const Stack = createNativeStackNavigator<RootStackParamList>();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
  },
};

export default function Navigation() {
  const [currentEpisode, setCurrentEpisode] = useState<{
    episode: Episode;
    podcastImage?: string;
  } | null>(null);

  function openPlayer(episode: Episode, podcastImage?: string) {
    setCurrentEpisode({ episode, podcastImage });
  }

  function closePlayer() {
    setCurrentEpisode(null);
  }

  return (
    <SafeAreaProvider>
    <PlayerContext.Provider value={{ openPlayer, closePlayer }}>
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
          }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PodcastDetail" component={PodcastDetailScreen}/>
      </Stack.Navigator>
    </NavigationContainer>

          {currentEpisode && (
          <PlayerSheet
            episode={currentEpisode.episode}
            podcastImage={currentEpisode.podcastImage}
            onClose={closePlayer}
          />
        )}

    </PlayerContext.Provider>
    </SafeAreaProvider>
  );
}