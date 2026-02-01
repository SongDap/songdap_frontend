"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import MusicPlayerExpandedView from "./MusicPlayerExpandedView";
import MusicPlayerBar from "./MusicPlayerBar";
import YouTubeAudioPlayer from "@/shared/ui/YouTubeAudioPlayer";

type MusicPlayerProps = {
  title: string;
  artist: string;
  videoId?: string;
  imageUrl?: string | null;
  message?: string;
  nickname?: string;
  backgroundColor?: string;
  hideUI?: boolean; // 편지 탭 등에서 UI 숨김(오디오는 유지)
  isOwner?: boolean | null; // 앨범 소유자 여부
  onClose?: () => void; // 플레이어를 닫을 때 호출
  onOpenYouTubeModal?: () => void; // 유튜브 모달 열기
  onPrevious?: () => void; // 이전곡
  onNext?: () => void; // 다음곡
  expandTrigger?: number; // 익스팬드뷰를 강제로 열기 위한 트리거
  autoPlayTrigger?: number; // 특정 액션(카드 재생 버튼 등)으로 자동재생 트리거
};

export default function MusicPlayer({ 
  title, 
  artist, 
  videoId,
  imageUrl, 
  message, 
  nickname, 
  backgroundColor,
  hideUI = false,
  isOwner = null,
  onClose,
  onOpenYouTubeModal,
  onPrevious,
  onNext,
  expandTrigger,
  autoPlayTrigger,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 기본은 하단 바(확장뷰는 명시적으로 열 때만)
  const [isClosing, setIsClosing] = useState(false); // 애니메이션 중인지 여부
  const [isOpening, setIsOpening] = useState(false); // 열리는 애니메이션 중인지 여부
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [playbackNotice, setPlaybackNotice] = useState<string | null>(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const noticeTimerRef = useRef<number | null>(null);
  const prevSongKeyRef = useRef<string>("");
  const prevExpandTriggerRef = useRef<number | undefined>(undefined);
  const prevAutoPlayTriggerRef = useRef<number | undefined>(undefined);

  // 곡이 변경되면 상태 리셋 (익스팬드뷰는 expandTrigger로만 제어)
  // NOTE: useEffect로 두면 "다음 곡 → 즉시 재생 클릭" 타이밍에서
  // 사용자의 setIsPlaying(true)가 뒤늦게 도는 리셋(setIsPlaying(false))에 의해 덮일 수 있음.
  // useLayoutEffect로 바꿔서 사용자 클릭 전에 리셋이 완료되도록 함.
  useLayoutEffect(() => {
    // "다음 곡"에서 항상 유튜브 아이콘으로 돌아가야 해서
    // 곡 변경 판단 기준에 videoId까지 포함 (title/artist만 쓰면 일부 케이스에서 리셋이 안 될 수 있음)
    const songKey = `${title}||${artist}||${videoId ?? ""}`;
    const isSongChanged = prevSongKeyRef.current !== songKey;

    if (isSongChanged || (prevSongKeyRef.current === "" && songKey !== "")) {
      // 곡이 변경되었거나 처음 로드될 때 재생 상태만 리셋
      setIsPlaying(false);
      setPlaybackNotice(null);
      setHasPlayedOnce(false);
    }
    prevSongKeyRef.current = songKey;
  }, [title, artist, videoId]);

  // 카드의 "재생" 버튼 등에서 확장뷰를 열면서 자동 재생까지 이어주기 위한 트리거
  // NOTE: songKey 리셋(useLayoutEffect) 이후에 동작해야 하므로, 같은 useLayoutEffect 체인에서 뒤에 둠.
  useLayoutEffect(() => {
    if (hideUI) {
      prevAutoPlayTriggerRef.current = autoPlayTrigger;
      return;
    }

    // 최초 마운트에서는 트리거를 소비하지 않음
    if (prevAutoPlayTriggerRef.current === undefined) {
      prevAutoPlayTriggerRef.current = autoPlayTrigger;
      return;
    }

    if (
      autoPlayTrigger !== undefined &&
      autoPlayTrigger !== prevAutoPlayTriggerRef.current
    ) {
      // 유튜브 videoId가 없으면 자동 재생 불가 → 안내만 표시
      if (!videoId || videoId.trim().length === 0) {
        setPlaybackNotice("유튜브 링크가 없어요.");
        if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
        noticeTimerRef.current = window.setTimeout(() => setPlaybackNotice(null), 2500);
      } else {
        setIsPlaying(true);
      }
      prevAutoPlayTriggerRef.current = autoPlayTrigger;
      return;
    }

    prevAutoPlayTriggerRef.current = autoPlayTrigger;
  }, [autoPlayTrigger, videoId, hideUI]);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const showPlaybackBlockedNotice = () => {
    setPlaybackNotice("재생이 차단됐어요. 다시 시도해주세요.");
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => {
      setPlaybackNotice(null);
    }, 3000);
  };

  // expandTrigger가 변경되면 익스팬드뷰 열기 (같은 곡을 클릭해도 열기)
  useEffect(() => {
    // 최초 마운트 시점에는 "이미 처리된 값"으로 간주하고 열지 않음
    if (prevExpandTriggerRef.current === undefined) {
      prevExpandTriggerRef.current = expandTrigger;
      return;
    }

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
    // 유튜브 videoId가 없으면 "소리 재생"을 할 수 없음
    if (!isPlaying && (!videoId || videoId.trim().length === 0)) {
      setPlaybackNotice("유튜브 링크가 없어요.");
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = window.setTimeout(() => setPlaybackNotice(null), 2500);
      return;
    }
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

  const audioNode = (
    <YouTubeAudioPlayer
      videoId={videoId}
      isPlaying={isPlaying}
      isModalOpen={isVideoModalOpen}
      onCloseModal={() => setIsVideoModalOpen(false)}
      onPlayingChange={(next) => {
        setIsPlaying(next);
        if (next) setHasPlayedOnce(true);
      }}
      onPlaybackBlocked={showPlaybackBlockedNotice}
      onEnded={() => setIsPlaying(false)}
    />
  );

  // UI를 숨기는 모드(예: 편지 탭)에서는 오디오만 유지하고,
  // 확장뷰/바텀시트가 열려있던 상태는 정리해서 뒤 UI와 충돌하지 않게 함
  useEffect(() => {
    if (!hideUI) return;
    setIsVideoModalOpen(false);
    setIsExpanded(false);
    setIsClosing(false);
    setIsOpening(false);
  }, [hideUI]);

  // 유튜브 버튼: 현재 숨김 플레이어를 모달로 보여주기
  const handleOpenYouTube = () => {
    setIsVideoModalOpen(true);
  };

  if (hideUI) {
    return <>{audioNode}</>;
  }

  if (isExpanded || isClosing) {
    return (
      <>
        {audioNode}
        <MusicPlayerExpandedView
        title={title}
        artist={artist}
        imageUrl={imageUrl}
        message={message}
        nickname={nickname}
        backgroundColor={backgroundColor}
        isOwner={isOwner}
        isPlaying={isPlaying}
        notice={playbackNotice}
        videoId={videoId}
        showMiniVideo={hasPlayedOnce}
        onPlayPause={handlePlayPause}
        onClose={handleCloseExpand}
        isClosing={isClosing}
        isOpening={isOpening}
        onPrevious={onPrevious}
        onNext={onNext}
        onOpenYouTubeModal={handleOpenYouTube}
        />
      </>
    );
  }

  return (
    <>
      {audioNode}
      <MusicPlayerBar
        title={title}
        artist={artist}
        imageUrl={imageUrl}
        isPlaying={isPlaying}
        notice={playbackNotice}
        videoId={videoId}
        showMiniVideo={hasPlayedOnce}
        onPlayPause={handlePlayPause}
        onExpand={handleToggleExpand}
        onOpenYouTubeModal={handleOpenYouTube}
        onPrevious={onPrevious}
        onNext={onNext}
        backgroundColor={backgroundColor}
      />
    </>
  );
}