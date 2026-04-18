import { ImageProps } from "react-native";

declare module "react-native-reanimated" {
  interface AnimatedProps<T> extends ImageProps {
    sharedTransitionTag?: string;
  }
}