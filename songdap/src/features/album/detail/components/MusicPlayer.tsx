"use client";

import { useState, useEffect, useRef } from "react";
import MusicPlayerExpandedView from "./MusicPlayerExpandedView";
import MusicPlayerBar from "./MusicPlayerBar";

type MusicPlayerProps = {
  title: string;
  artist: string;
  imageUrl?: string | null;
  message?: string;
  nickname?: string;
  backgroundColor?: string;
  onClose?: () => void; // 플레이어를 닫을 때 호출
  onOpenYouTubeModal?: () => void; // 유튜브 모달 열기
  onPrevious?: () => void; // 이전곡
  onNext?: () => void; // 다음곡
  expandTrigger?: number; // 익스팬드뷰를 강제로 열기 위한 트리거
};

export default function MusicPlayer({ 
  title, 
  artist, 
  imageUrl, 
  message, 
  nickname, 
  backgroundColor,
  onClose,
  onOpenYouTubeModal,
  onPrevious,
  onNext,
  expandTrigger,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 기본은 하단 바(확장뷰는 명시적으로 열 때만)
  const [isClosing, setIsClosing] = useState(false); // 애니메이션 중인지 여부
  const [isOpening, setIsOpening] = useState(false); // 열리는 애니메이션 중인지 여부
  const prevTitleRef = useRef<string>("");
  const prevArtistRef = useRef<string>("");
  const prevExpandTriggerRef = useRef<number | undefined>(undefined);

  // 곡이 변경되면 재생 상태만 리셋 (익스팬드뷰는 expandTrigger로만 제어)
  useEffect(() => {
    const isSongChanged = prevTitleRef.current !== title || prevArtistRef.current !== artist;
    if (isSongChanged || (prevTitleRef.current === "" && title !== "")) {
      // 곡이 변경되었거나 처음 로드될 때 재생 상태만 리셋
      setIsPlaying(false);
    }
    prevTitleRef.current = title;
    prevArtistRef.current = artist;
  }, [title, artist]);

  // expandTrigger가 변경되면 익스팬드뷰 열기 (같은 곡을 클릭해도 열기)
  useEffect(() => {
    if (expandTrigger !== undefined && expandTrigger !== prevExpandTriggerRef.current) {
      setIsOpening(true);
      setIsExpanded(true);
      setTimeout(() => {
        setIsOpening(false);
      }, 300);
      prevExpandTriggerRef.current = expandTrigger;
    }
  }, [expandTrigger]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleToggleExpand = () => {
    if (!isExpanded) {
      setIsOpening(true); // 열리는 애니메이션 시작
      setIsExpanded(true);
      setTimeout(() => {
        setIsOpening(false);
      }, 300);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleCloseExpand = () => {
    setIsClosing(true); // 애니메이션 시작
    setTimeout(() => {
      setIsExpanded(false); // 애니메이션 후 실제로 접기
      setIsClosing(false);
    }, 300); // 애니메이션 시간과 동일
  };

  if (isExpanded || isClosing) {
    return (
      <MusicPlayerExpandedView
        title={title}
        artist={artist}
        imageUrl={imageUrl}
        message={message}
        nickname={nickname}
        backgroundColor={backgroundColor}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onClose={handleCloseExpand}
        isClosing={isClosing}
        isOpening={isOpening}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );
  }

  return (
    <MusicPlayerBar
      title={title}
      artist={artist}
      imageUrl={imageUrl}
      isPlaying={isPlaying}
      onPlayPause={handlePlayPause}
      onExpand={handleToggleExpand}
      onOpenYouTubeModal={onOpenYouTubeModal}
      onPrevious={onPrevious}
      onNext={onNext}
      backgroundColor={backgroundColor}
    />
  );
}