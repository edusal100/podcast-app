import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { SharedTransition } from "react-native-reanimated";
import { StyleProp, ImageStyle } from "react-native";

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);
const transition = SharedTransition.duration(400).springify().damping(20).stiffness(200);

type Props = {
  uri?: string;
  sharedTag?: string;
  style?: StyleProp<ImageStyle>;
  borderRadius?: number;
};

export default function MediaImage({ uri, sharedTag, style, borderRadius = 0 }: Props) {
    if (!uri) return null;

  return (
    <AnimatedExpoImage
      sharedTransitionTag={sharedTag}
      sharedTransitionStyle={sharedTag ? transition : undefined}
      source={{ uri }}
      style={[{ borderRadius }, style]}
      cachePolicy="memory-disk"
      contentFit="cover"
      transition={300}
    />
  );
}