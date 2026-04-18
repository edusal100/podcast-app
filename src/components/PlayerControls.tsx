import { View, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

type Props = {
  isPlaying: boolean;
  isLoading: boolean;
  onToggle: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
};

export default function PlayerControls({ isPlaying, isLoading, onToggle, onSkipBack, onSkipForward }: Props) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 36 }}>

      <Pressable onPress={onSkipBack}>
        <Ionicons name="play-back" size={32} color={colors.text} />
      </Pressable>

      <Pressable
        onPress={onToggle}
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading
          ? <ActivityIndicator color={colors.surface} />
          : <Ionicons name={isPlaying ? "pause" : "play"} size={32} color={colors.text} style={{ transform: [{ translateX: isPlaying ? 0 : 2 }] }} />
        }
      </Pressable>

      <Pressable onPress={onSkipForward}>
        <Ionicons name="play-forward" size={32} color={colors.text} />
      </Pressable>

    </View>
  );
}