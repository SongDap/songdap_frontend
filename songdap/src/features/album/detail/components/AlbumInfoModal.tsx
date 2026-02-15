"use client";

import { HiX, HiLockOpen, HiLockClosed } from "react-icons/hi";
import { AlbumCover } from "@/shared/ui";
import type { AlbumResponse } from "@/features/album/api";

type AlbumInfoModalProps = {
  album: AlbumResponse;
  isOwner: boolean | null;
  isEditMode: boolean;
  tempIsPublic: boolean;
  isVisibilityUpdating: boolean;
  onClose: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onTempIsPublicChange: (value: boolean) => void;
  onVisibilityToggle: () => Promise<void>;
};

export default function AlbumInfoModal({
  album,
  isOwner,
  isEditMode,
  tempIsPublic,
  isVisibilityUpdating,
  onClose,
  onStartEdit,
  onCancelEdit,
  onTempIsPublicChange,
  onVisibilityToggle,
}: AlbumInfoModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[120]"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative px-4 py-3 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 text-center">앨범 정보</h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              aria-label="닫기"
            >
              <HiX className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="p-5">
            {!isEditMode ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlbumCover
                      size={92}
                      backgroundColorHex={album.color}
                      imageUrl={undefined}
                      lpSize={92 * 0.8}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          album.isPublic
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {album.isPublic ? "공개" : "비공개"}
                      </span>
                      <span className="text-sm text-gray-600">
                        {album.musicCount}/{album.musicCountLimit}곡
                      </span>
                    </div>

                    <div className="mt-2 text-lg font-bold text-gray-900 break-words">
                      {album.title}
                    </div>

                    {album.createdAt && (
                      <div className="mt-1 text-xs text-gray-500">
                        {String(album.createdAt).slice(0, 10)}
                      </div>
                    )}
                  </div>
                </div>

                {album.description && (
                  <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto scrollbar-hide">
                    {album.description}
                  </div>
                )}

                <div className="mt-5 flex gap-2">
                  {isOwner === true && (
                    <button
                      type="button"
                      onClick={onStartEdit}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-semibold transition-colors"
                    >
                      수정하기
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className={`py-2.5 px-4 rounded-xl bg-[#006FFF] text-white text-sm font-semibold hover:bg-[#0056CC] active:bg-[#0044AA] transition-colors ${isOwner === true ? "flex-1" : "w-full"}`}
                  >
                    닫기
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-base font-medium text-gray-900">
                      공개설정
                    </label>
                    <div className="flex items-center gap-3">
                      {tempIsPublic ? (
                        <>
                          <span className="text-base text-gray-700">공개</span>
                          <HiLockOpen className="w-5 h-5 text-gray-700" />
                        </>
                      ) : (
                        <>
                          <span className="text-base text-gray-700">비공개</span>
                          <HiLockClosed className="w-5 h-5 text-gray-700" />
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => onTempIsPublicChange(!tempIsPublic)}
                        disabled={isVisibilityUpdating}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          tempIsPublic ? "bg-[#006FFF]" : "bg-gray-300"
                        }`}
                        role="switch"
                        aria-checked={tempIsPublic}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            tempIsPublic ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 text-left">
                    {tempIsPublic
                      ? "현재는 공개 상태입니다."
                      : "현재는 비공개 상태입니다."}
                  </p>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={onVisibilityToggle}
                    disabled={isVisibilityUpdating || tempIsPublic === album.isPublic}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#006FFF] text-white text-sm font-semibold hover:bg-[#0056CC] active:bg-[#0044AA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isVisibilityUpdating ? "저장 중..." : "저장"}
                  </button>
                  <button
                    type="button"
                    onClick={onCancelEdit}
                    disabled={isVisibilityUpdating}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-sm font-semibold transition-colors"
                  >
                    취소
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
