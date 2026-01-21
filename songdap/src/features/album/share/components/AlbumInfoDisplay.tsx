"use client";
import { AlbumCover } from "@/shared/ui";
import { HiLockOpen, HiLockClosed } from "react-icons/hi";

export type AlbumData = {
  title: string;
  description: string;
  isPublic: boolean;
  musicCountLimit: number; // 설정된 앨범 곡 개수
  musicCount?: number; // 현재 곡 개수 (optional)
  color: string;
};

type AlbumInfoDisplayProps = {
  albumData: AlbumData;
  albumColor: string;
  todayDate: string;
};

export default function AlbumInfoDisplay({ albumData, albumColor, todayDate }: AlbumInfoDisplayProps) {
  return (
    <>
      {/* 앨범 커버 */}
      <div className="flex justify-center mb-8">
        <AlbumCover 
          size={150} 
          backgroundColor={undefined}
          backgroundColorHex={albumColor}
        />
      </div>

      {/* 공개 여부 태그 + 앨범명 */}
      <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
        {/* 공개/비공개 태그 */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
            albumData.isPublic
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          {albumData.isPublic ? (
            <HiLockOpen className="w-4 h-4" />
          ) : (
            <HiLockClosed className="w-4 h-4" />
          )}
          <span>{albumData.isPublic ? "공개" : "비공개"}</span>
        </div>

        {/* 앨범명 */}
        <span className="text-[30px] font-bold text-gray-900 leading-none">
          {albumData.title}
        </span>
      </div>

      {/* 앨범 설명 */}
      {albumData.description && (
        <div className="mb-6">
          <p className="text-base text-gray-700">
            &ldquo;{albumData.description}&rdquo;
          </p>
        </div>
      )}

      {/* 곡개수 | 날짜 */}
      {todayDate && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
          <span>
            {albumData.musicCount !== undefined
              ? `${albumData.musicCount}/${albumData.musicCountLimit}곡`
              : `${albumData.musicCountLimit}곡`}
          </span>
          <span>|</span>
          <span>{todayDate}</span>
        </div>
      )}
    </>
  );
}
