import { Podcast } from "@/types/podcast";

export type RootStackParamList = {
  Home: undefined;
  PodcastDetail: { podcast: Podcast };
};