"use client";

import { useEffect, useRef, useState } from "react";

const YT_IFRAME_API_SRC = "https://www.youtube.com/iframe_api";

const YT_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

const PLAYBACK_BLOCKED_TIMEOUT_MS = 1200;
const SHEET_MAX_HEIGHT_RATIO = 0.7;
const VIDEO_ASPECT_W = 16;
const VIDEO_ASPECT_H = 9;

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

type YouTubeAudioPlayerProps = {
  videoId?: string;
  isPlaying: boolean;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
  onPlayingChange?: (isPlaying: boolean) => void;
  onPlaybackBlocked?: () => void;
  onEnded?: () => void;
};

export default function YouTubeAudioPlayer({
  videoId,
  isPlaying,
  isModalOpen = false,
  onCloseModal,
  onPlayingChange,
  onPlaybackBlocked,
  onEnded,
}: YouTubeAudioPlayerProps) {
  // IMPORTANT: YT.Player가 붙는 DOM은 절대 교체/언마운트되면 안 됨
  // (열고 닫을 때 DOM이 바뀌면 플레이어가 쉽게 꼬임)
  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const playerViewportRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  const [isApiReady, setIsApiReady] = useState(false);
  const [videoAreaHeight, setVideoAreaHeight] = useState<number | null>(null);

  // 최신 값/콜백을 이벤트 핸들러에서 안전하게 참조
  const desiredPlayingRef = useLatestRef(isPlaying);
  const onPlayingChangeRef = useLatestRef(onPlayingChange);
  const onPlaybackBlockedRef = useLatestRef(onPlaybackBlocked);
  const onEndedRef = useLatestRef(onEnded);

  // 1) YouTube IFrame API 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    const markReady = () => setIsApiReady(true);

    if (window.YT?.Player) {
      markReady();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${YT_IFRAME_API_SRC}"]`
    );

    if (existing) {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        markReady();
      };
      return;
    }

    const script = document.createElement("script");
    script.src = YT_IFRAME_API_SRC;
    script.async = true;

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      markReady();
    };

    document.body.appendChild(script);
  }, []);

  // 2) 플레이어 생성 (1회)
  useEffect(() => {
    if (!isApiReady) return;
    if (!playerHostRef.current) return;
    if (playerRef.current) return;

    // origin을 playerVars에 넣으면 YouTube iframe postMessage와 충돌해
    // "Unable to post message to https://www.youtube.com. Recipient has origin https://..." 콘솔 에러가 날 수 있음.
    // YouTube API가 iframe src에 origin을 자동으로 붙이므로 여기서는 생략.
    playerRef.current = new window.YT.Player(playerHostRef.current, {
      height: "1",
      width: "1",
      videoId: videoId || undefined,
      playerVars: {
        autoplay: 0,
        controls: 1,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onStateChange: (e: any) => {
          const state = e?.data;
          // "재생 중"으로 간주: playing, buffering
          if (state === YT_STATE.PLAYING || state === YT_STATE.BUFFERING) {
            onPlayingChangeRef.current?.(true);
            return;
          }

          // "멈춤"으로 간주: paused
          if (state === YT_STATE.PAUSED) {
            onPlayingChangeRef.current?.(false);
            return;
          }

          // 곡 전환 직후 cued/unstarted 이벤트가 먼저 오는 경우가 많음.
          // 사용자가 이미 재생을 눌러 "재생 의도"가 있으면 false로 덮어쓰지 않음
          if (
            (state === YT_STATE.CUED || state === YT_STATE.UNSTARTED) &&
            !desiredPlayingRef.current
          ) {
            onPlayingChangeRef.current?.(false);
            return;
          }

          if (state === YT_STATE.ENDED) {
            onPlayingChangeRef.current?.(false);
            onEndedRef.current?.();
          }
        },
        onError: () => {
          // 임베드 제한/재생 불가 케이스 포함
          onPlayingChangeRef.current?.(false);
          onPlaybackBlockedRef.current?.();
        },
      },
    });
  }, [isApiReady]);

  // 3) 재생/일시정지 + videoId 변경 반영
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (!videoId) {
      try {
        player.stopVideo?.();
      } catch {
        // ignore
      }
      return;
    }

    try {
      // videoId가 바뀐 경우:
      // - isPlaying=false이면 자동재생이 되면 안 되므로 cue(대기)로만 로드
      // - isPlaying=true일 때만 load(재생)로 로드
      const current = player.getVideoData?.()?.video_id;
      if (current !== videoId) {
        if (isPlaying) {
          player.loadVideoById?.(videoId);
        } else {
          player.cueVideoById?.(videoId);
        }
      }

      if (isPlaying) {
        player.playVideo?.();
      } else {
        player.pauseVideo?.();
      }
    } catch {
      // ignore
    }
  }, [videoId, isPlaying]);

  // 재생 시도했는데도 일정 시간 내 playing/buffering이 안 되면 "자동재생 정책 차단"으로 간주
  useEffect(() => {
    if (!isPlaying) return;
    if (!videoId || videoId.trim().length === 0) return;

    const player = playerRef.current;
    if (!player) return;

    const timer = window.setTimeout(() => {
      try {
        const state = player.getPlayerState?.();
        // playing/buffering이면 정상
        if (state === YT_STATE.PLAYING || state === YT_STATE.BUFFERING) return;

        // 재생이 안 됐으면 UI를 "멈춤"으로 되돌리고 안내
        onPlayingChangeRef.current?.(false);
        onPlaybackBlockedRef.current?.();
      } catch {
        onPlayingChangeRef.current?.(false);
        onPlaybackBlockedRef.current?.();
      }
    }, PLAYBACK_BLOCKED_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isPlaying, videoId]);

  // 모달 열림/닫힘에 따라 플레이어 크기 조절 (같은 플레이어를 보여주기)
  useEffect(() => {
    const player = playerRef.current;
    const viewport = playerViewportRef.current;
    if (!player || !viewport) return;

    const setSizeFromViewport = () => {
      try {
        const rect = viewport.getBoundingClientRect();
        player.setSize?.(
          Math.max(1, Math.floor(rect.width)),
          Math.max(1, Math.floor(rect.height))
        );
      } catch {
        // ignore
      }
    };

    // 닫히면 0x0으로 줄여서 사실상 숨김
    if (!isModalOpen) {
      try {
        player.setSize?.(0, 0);
      } catch {
        // ignore
      }
      return;
    }

    // 열릴 때는 레이아웃이 잡힌 뒤 사이즈 측정이 안전해서 rAF로 한 번 늦춤
    const raf = requestAnimationFrame(() => setSizeFromViewport());

    // 열려있는 동안 리사이즈/회전 대응
    const ro = new ResizeObserver(() => setSizeFromViewport());
    ro.observe(viewport);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [isModalOpen]);

  // 바텀시트 크기를 "유튜브 영상(16:9)" 크기에 맞춤
  useEffect(() => {
    if (!isModalOpen) {
      setVideoAreaHeight(null);
      return;
    }

    const sheet = sheetRef.current;
    if (!sheet) return;

    const calc = () => {
      const w = sheet.getBoundingClientRect().width;
      // 16:9 비율
      const desired = Math.floor((w * VIDEO_ASPECT_H) / VIDEO_ASPECT_W);

      // 화면 세로가 작은 경우를 대비해 최대 높이 제한
      const maxSheet = Math.floor(window.innerHeight * SHEET_MAX_HEIGHT_RATIO); // 시트는 화면의 70%까지만
      const headerH = Math.floor(headerRef.current?.getBoundingClientRect().height ?? 0);
      const maxVideo = Math.max(1, maxSheet - headerH);

      setVideoAreaHeight(Math.min(desired, maxVideo));
    };

    calc();
    const ro = new ResizeObserver(() => calc());
    ro.observe(sheet);
    window.addEventListener("resize", calc);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, [isModalOpen]);

  // 바텀시트가 열려있는 동안 뒤 스크롤만 잠금 (오버레이는 없음)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isModalOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    // iOS/모바일에서 바운스 스크롤도 최대한 억제
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, [isModalOpen]);

  // 바텀시트가 열린 상태에서 "다른 버튼/영역"을 누르면 먼저 닫히게
  // - 오버레이(차단 레이어)를 깔지 않기 위해, 캡처 단계에서 감지 후 닫기만 함
  // - 이벤트는 막지 않아서, 뒤 버튼 클릭은 그대로 동작할 수 있음
  useEffect(() => {
    if (!isModalOpen) return;
    if (typeof document === "undefined") return;

    const onPointerDownCapture = (e: PointerEvent) => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const target = e.target as Node | null;
      if (!target) return;

      // 바텀시트 내부 클릭은 무시
      if (sheet.contains(target)) return;

      onCloseModal?.();
    };

    const onKeyDownCapture = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseModal?.();
    };

    document.addEventListener("pointerdown", onPointerDownCapture, true);
    document.addEventListener("keydown", onKeyDownCapture, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
      document.removeEventListener("keydown", onKeyDownCapture, true);
    };
  }, [isModalOpen, onCloseModal]);

  // 실제 화면에는 안 보이게 숨김(오디오는 재생됨) / 모달로 보여주기
  return (
    <>
      {/* 
        유튜브 플레이어 DOM은 항상 1개만 유지.
        닫혀 있을 때는 화면 밖 0x0으로 숨김.
        열려 있을 때는 바텀시트(드로어) UI로 보여주기. (오버레이 없음)
      */}
      <div
        className={
          isModalOpen
            ? "fixed left-0 right-0 bottom-0 z-[100] flex justify-center"
            : ""
        }
        style={
          isModalOpen
            ? undefined
            : {
                position: "fixed",
                width: 0,
                height: 0,
                overflow: "hidden",
                opacity: 0,
                pointerEvents: "none",
                left: -9999,
                top: -9999,
              }
        }
      >
        <div
          ref={sheetRef}
          className={
            isModalOpen
              ? "w-full md:w-[672px] bg-white rounded-t-[20px] overflow-hidden shadow-2xl flex flex-col"
              : ""
          }
          onClick={(e) => e.stopPropagation()}
        >
          {isModalOpen && (
            <div
              ref={headerRef}
              className="relative bg-white px-4 pt-3 pb-2 border-b border-gray-200"
            >
              {/* 드래그 핸들처럼 보이는 바 */}
              <div className="w-full flex justify-center">
                <div className="w-10 h-1 rounded-full bg-gray-300 mb-2" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 text-center">
                노래 동영상
              </h2>
              <button
                onClick={onCloseModal}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="닫기"
              >
                ×
              </button>
            </div>
          )}

          <div
            ref={playerViewportRef}
            className={isModalOpen ? "relative w-full" : ""}
            style={
              isModalOpen
                ? { height: videoAreaHeight ? `${videoAreaHeight}px` : undefined }
                : undefined
            }
          >
            {/* YT.Player가 붙는 실제 호스트 (항상 동일 DOM) */}
            <div ref={playerHostRef} className={isModalOpen ? "w-full h-full" : ""} />

            {isModalOpen && (!videoId || videoId.trim().length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <p className="text-gray-700 text-center px-6">
                  유튜브 링크가 없는 노래예요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

