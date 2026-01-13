"use client";

import { useState } from "react";
import Image from "next/image";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { COLORS, FONTS, responsive, INPUT_BOX_STYLE, TEXT_SIZES } from "@/features/album/create/constants";

interface SpotifySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSong?: (song: { title: string; artist: string; imageUrl?: string }) => void;
}

/**
 * Spotify 검색 모달 컴포넌트
 * 화면 아래에 표시되는 모달
 */
export default function SpotifySearchModal({
  isOpen,
  onClose,
  onSelectSong,
}: SpotifySearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  if (!isOpen) return null;

  // TODO: Spotify API 검색 구현
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // TODO: Spotify Web API 호출
    // const results = await searchSpotify(searchQuery);
    // setSearchResults(results);
    
    console.log("검색어:", searchQuery);
  };

  const handleSelectSong = (song: { title: string; artist: string; imageUrl?: string }) => {
    onSelectSong?.(song);
    onClose();
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 9998,
        }}
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.BACKGROUND,
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          padding: responsive.sizeVh(20, 24, 28, 28),
          paddingTop: responsive.sizeVh(30, 36, 42, 42),
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.3)",
          zIndex: 9999,
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: responsive.sizeVh(16, 20, 24, 24),
            right: responsive.sizeVh(16, 20, 24, 24),
            width: responsive.sizeVh(32, 36, 40, 40),
            height: responsive.sizeVh(32, 36, 40, 40),
            border: "none",
            backgroundColor: "transparent",
            fontSize: responsive.fontSize(24, 26, 28, 30),
            cursor: "pointer",
            color: COLORS.BLACK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONTS.KYOBO_HANDWRITING,
          }}
        >
          ×
        </button>

        {/* 제목 */}
        <div
          style={{
            fontFamily: FONTS.KYOBO_HANDWRITING,
            fontSize: responsive.fontSize(22, 26, 30, 32),
            color: COLORS.BLACK,
            fontWeight: "bold",
            marginBottom: responsive.sizeVh(20, 24, 28, 28),
            textAlign: "center",
          }}
        >
          노래 검색하기
        </div>

        {/* 검색 입력 영역 */}
        <div
          style={{
            marginBottom: responsive.sizeVh(20, 24, 28, 28),
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            {/* Spotify 이미지 (왼쪽) */}
            <div
              style={{
                position: "absolute",
                left: responsive.sizeVh(12, 14, 16, 16),
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/images/spotify.png"
                alt="Spotify"
                width={24}
                height={24}
                style={{
                  width: responsive.sizeVh(20, 24, 28, 28),
                  height: responsive.sizeVh(20, 24, 28, 28),
                  objectFit: "contain",
                }}
              />
            </div>

            {/* 검색 입력창 */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="노래 제목 또는 아티스트명을 입력하세요"
              style={{
                ...INPUT_BOX_STYLE,
                width: "100%",
                height: "48px",
                paddingLeft: responsive.sizeVh(50, 60, 70, 70),
                paddingRight: responsive.sizeVh(50, 60, 70, 70),
                border: "3px solid #1ED760",
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: TEXT_SIZES.INPUT,
                color: COLORS.BLACK,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {/* 돋보기 검색 버튼 (오른쪽) */}
            <button
              onClick={handleSearch}
              type="button"
              style={{
                position: "absolute",
                right: responsive.sizeVh(12, 14, 16, 16),
                top: "50%",
                transform: "translateY(-50%)",
                width: responsive.sizeVh(32, 36, 40, 40),
                height: responsive.sizeVh(32, 36, 40, 40),
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                color: "#1ED760",
              }}
            >
              <HiMagnifyingGlass size={28} />
            </button>
          </div>
        </div>

        {/* 검색 결과 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: responsive.sizeVh(12, 14, 16, 16),
          }}
        >
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSelectSong({
                  title: result.name,
                  artist: result.artists?.[0]?.name || "",
                  imageUrl: result.album?.images?.[0]?.url,
                })}
                style={{
                  display: "flex",
                  gap: responsive.sizeVh(12, 14, 16, 16),
                  padding: responsive.sizeVh(12, 14, 16, 16),
                  border: "2px solid #000",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: COLORS.WHITE,
                  alignItems: "center",
                }}
              >
                {result.album?.images?.[0]?.url && (
                  <img
                    src={result.album.images[0].url}
                    alt={result.name}
                    style={{
                      width: responsive.sizeVh(60, 70, 80, 80),
                      height: responsive.sizeVh(60, 70, 80, 80),
                      borderRadius: "8px",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: responsive.sizeVh(4, 5, 6, 6),
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONTS.KYOBO_HANDWRITING,
                      fontSize: responsive.fontSize(16, 18, 20, 20),
                      color: COLORS.BLACK,
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {result.name}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.KYOBO_HANDWRITING,
                      fontSize: responsive.fontSize(14, 16, 18, 18),
                      color: COLORS.BLACK,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {result.artists?.[0]?.name || ""}
                  </div>
                </div>
              </div>
            ))
          ) : searchQuery ? (
            <div
              style={{
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: responsive.fontSize(16, 18, 20, 20),
                color: COLORS.BLACK,
                textAlign: "center",
                padding: responsive.sizeVh(40, 50, 60, 60),
              }}
            >
              검색 결과가 없습니다
            </div>
          ) : (
            <div
              style={{
                fontFamily: FONTS.KYOBO_HANDWRITING,
                fontSize: responsive.fontSize(16, 18, 20, 20),
                color: COLORS.BLACK,
                textAlign: "center",
                padding: responsive.sizeVh(40, 50, 60, 60),
              }}
            >
              노래 제목 또는 아티스트명을 검색해보세요
            </div>
          )}
        </div>
      </div>
    </>
  );
}

