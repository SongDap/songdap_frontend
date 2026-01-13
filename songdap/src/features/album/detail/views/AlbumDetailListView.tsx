"use client";

import { responsive, COLORS } from "@/features/album/create/constants";
import { AlbumCoverWithLP, NicknameTag } from "@/shared/ui";
import AlbumDetailYouTubePlayer from "../components/AlbumDetailYouTubePlayer";
import AlbumDetailSongList from "../components/AlbumDetailSongList";
import type { AlbumData } from "@/features/song/components/types";

interface AlbumDetailListViewProps {
  album: AlbumData;
  lpSize: number;
  youtubeVideoId: string | null;
  onSongClick: (index: number) => void;
  onPlayClick: (index: number) => void;
  onCloseVideo?: () => void;
}

export default function AlbumDetailListView({
  album,
  lpSize,
  youtubeVideoId,
  onSongClick,
  onPlayClick,
  onCloseVideo,
}: AlbumDetailListViewProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingTop: "80px",
        paddingBottom: responsive.sizeVh(100, 120, 140, 140),
        paddingLeft: responsive.min(32),
        paddingRight: responsive.min(32),
        overflowY: "auto",
        boxSizing: "border-box",
        gap: responsive.sizeVh(24, 32, 40, 40),
      }}
    >
      {/* 앨범 커버와 LP */}
      <div style={{ alignSelf: "center" }}>
        <AlbumCoverWithLP
          coverImageUrl={album.coverImageUrl}
          coverColor={album.coverColor || COLORS.WHITE}
          lpCircleColor={album.lpColor}
          lpCircleImageUrl={album.lpCircleImageUrl}
          lpSize={Math.round(lpSize * 0.9)}
          coverSize={lpSize}
          albumName={album.albumName}
          tag={album.categoryTag}
          bottomContent={
            album.nickname ? (
              <NicknameTag
                nickname={album.nickname}
                profileImageUrl={album.profileImageUrl}
                coverSize={lpSize}
              />
            ) : undefined
          }
          showCoverText={true}
        />
      </div>

      {/* YouTube 영상 프레임 (항상 표시) */}
      <AlbumDetailYouTubePlayer videoId={youtubeVideoId} onClose={onCloseVideo} />

      {/* 노래 목록 */}
      <AlbumDetailSongList
        album={album}
        onSongClick={onSongClick}
        onPlayClick={onPlayClick}
      />
    </div>
  );
}

