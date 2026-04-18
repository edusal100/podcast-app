import { createContext, useContext } from "react";
import { Episode } from "@/types/podcast";

type PlayerContextType = {
  openPlayer: (episode: Episode, podcastImage?: string) => void;
  closePlayer: () => void;
};

const PlayerContext = createContext<PlayerContextType>({
  openPlayer: () => {},
  closePlayer: () => {},
});

export function usePlayer() {
  return useContext(PlayerContext);
}

export { PlayerContext };