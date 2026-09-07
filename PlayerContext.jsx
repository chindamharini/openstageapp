import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = queue[index] || null;

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    const onTime = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnd = () => next();

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.audio_url;
    if (isPlaying) audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  function playQueue(tracks, startIndex = 0) {
    setQueue(tracks);
    setIndex(startIndex);
    setIsPlaying(true);
    requestAnimationFrame(() => audioRef.current?.play().catch(() => {}));
  }

  function playTrack(track) {
    playQueue([track], 0);
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().catch(() => {}); setIsPlaying(true); }
  }

  function next() {
    if (index < queue.length - 1) { setIndex((i) => i + 1); setIsPlaying(true); }
    else setIsPlaying(false);
  }

  function prev() {
    if (index > 0) { setIndex((i) => i - 1); setIsPlaying(true); }
  }

  function seek(time) {
    if (audioRef.current) audioRef.current.currentTime = time;
  }

  const value = { currentTrack, isPlaying, progress, duration, playTrack, playQueue, toggle, next, prev, seek };
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  return useContext(PlayerContext);
}
