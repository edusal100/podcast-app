import { useAudioPlayer, useAudioPlayerStatus, AudioModule } from "expo-audio";
import { saveProgress, getProgress } from "@/services/progressDb";
import { useEffect, useRef } from "react";

export function useAudioPlayerControls(audioUrl: string, episodeId: string) {
  const player = useAudioPlayer({ uri: audioUrl });
  const status = useAudioPlayerStatus(player);
  const currentTimeRef = useRef(0);
  const hasRestored = useRef(false);

  // keep ref in sync, only with non-zero values
  useEffect(() => {
    if ((status.currentTime ?? 0) > 0) {
      currentTimeRef.current = status.currentTime ?? 0;
    }
  }, [status.currentTime]);

  useEffect(() => {
    if (!status.isLoaded || hasRestored.current) return;
    hasRestored.current = true; // ← mark as done immediately
    
    const saved = getProgress(episodeId);
    if (saved > 0) {
      setTimeout(() => {
        player.seekTo(saved / 1000);
      }, 500);
    }
  }, [status.isLoaded]);

  // save progress every 5 seconds while playing
  useEffect(() => {
    if (!status.playing) return;
    const interval = setInterval(() => {
      const pos = Math.floor(currentTimeRef.current * 1000);
      const dur = Math.floor((status.duration ?? 0) * 1000);
      if (pos === 0) return;
      saveProgress(episodeId, pos, dur);
    }, 5000);
    return () => clearInterval(interval);
  }, [status.playing]);

  // audio mode
  useEffect(() => {
    AudioModule.setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  function togglePlay() {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  }

  function seek(millis: number) {
    player.seekTo(millis / 1000);
  }

  function skip(seconds: number) {
    const next = Math.min(
      Math.max((status.currentTime ?? 0) + seconds, 0),
      status.duration ?? 0
    );
    player.seekTo(next);
  }

  return {
    isPlaying: status.playing,
    isLoading: status.isBuffering || !status.isLoaded,
    position: (status.currentTime ?? 0) * 1000,
    duration: (status.duration ?? 0) * 1000,
    togglePlay,
    seek,
    skip,
  };
}