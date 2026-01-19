"use client";

import Image from "next/image";

type SongLetterProps = {
  nickname?: string;
  message?: string;
  title?: string;
  artist?: string;
  imageUrl?: string | null;
  date?: string;
  className?: string;
  tapeColor?: string; // 테이프 색상 (앨범 커버 색상)
};

export default function SongLetter({
  nickname,
  message,
  title,
  artist,
  imageUrl,
  date,
  className = "",
  tapeColor,
}: SongLetterProps) {
  return (
    <div 
      className={`rounded-lg shadow-lg p-6 border border-gray-200 w-full relative ${className}`}
      style={{
        background: `
          repeating-linear-gradient(
            0deg,
            #fafafa 0px,
            #fafafa 1px,
            transparent 1px,
            transparent 2px
          ),
          repeating-linear-gradient(
            90deg,
            #fafafa 0px,
            #fafafa 1px,
            transparent 1px,
            transparent 2px
          ),
          linear-gradient(to bottom, #fafafa, #f5f5f5)
        `,
        backgroundSize: '20px 20px, 20px 20px, 100% 100%',
      }}
    >
      {/* 둥근 테이프 */}
      {tapeColor && (
        <div 
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-6 rounded-full"
          style={{
            backgroundColor: tapeColor,
            opacity: 0.7,
          }}
        />
      )}
      {/* 노래 이미지 */}
      {imageUrl && (
        <div className="mb-4 flex justify-center">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={title || "노래 이미지"}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* 노래 제목 */}
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
          {title}
        </h3>
      )}

      {/* 아티스트 */}
      {artist && (
        <p className="text-base text-gray-600 mb-4 text-center">
          {artist}
        </p>
      )}

      {/* 메시지 */}
      {message && (
        <div className="mb-4 max-w-2xl mx-auto">
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line text-center">
            {message}
          </p>
        </div>
      )}

      {/* 닉네임과 날짜 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {nickname && (
          <p className="text-sm text-gray-600">
            From. {nickname}
          </p>
        )}
        {date && (
          <p className="text-sm text-gray-500">
            {date}
          </p>
        )}
      </div>
    </div>
  );
}
