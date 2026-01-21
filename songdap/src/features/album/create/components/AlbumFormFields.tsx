"use client";
import { useRef, useEffect } from "react";
import { HiLockOpen, HiLockClosed } from "react-icons/hi";
import { HiMinus, HiPlus, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { PRESET_COLORS } from "@/shared/lib/mockData";

export type AlbumFormData = {
  title: string;
  description: string;
  isPublic: boolean;
  musicCountLimit: number; // 설정된 앨범 곡 개수
  color: string;
};

type AlbumFormFieldsProps = {
  formData: AlbumFormData;
  onFormDataChange: (field: string, value: string | number | boolean) => void;
  songCountInput: string;
  onSongCountInputChange: (value: string) => void;
  colorScrollRef: React.RefObject<HTMLDivElement | null>;
  submitButtonRef?: React.RefObject<HTMLButtonElement | null>;
};

export default function AlbumFormFields({
  formData,
  onFormDataChange,
  songCountInput,
  onSongCountInputChange,
  colorScrollRef,
  submitButtonRef,
}: AlbumFormFieldsProps) {
  // 선택된 색상으로 스크롤
  useEffect(() => {
    if (colorScrollRef.current) {
      const selectedButton = colorScrollRef.current.querySelector(
        `[data-color="${formData.color}"]`
      ) as HTMLElement;
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [formData.color, colorScrollRef]);

  const scrollColors = (direction: "left" | "right") => {
    if (colorScrollRef.current) {
      const scrollAmount = 200;
      colorScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSongCountChange = (value: string) => {
    onSongCountInputChange(value);
    if (value === "") {
      // 빈 값이면 일단 입력창만 업데이트 (onBlur에서 처리)
      return;
    }
    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        onFormDataChange("musicCountLimit", numValue);
      }
    }
  };

  return (
    <>
      {/* 앨범명 */}
      <div>
        <label className="block text-base font-medium text-gray-900 mb-2">
          앨범명
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onFormDataChange("title", e.target.value)}
          onBlur={() => {
            if (formData.title.trim() && submitButtonRef?.current) {
              setTimeout(() => {
                submitButtonRef.current?.focus();
              }, 0);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && formData.title.trim() && submitButtonRef?.current) {
              e.preventDefault();
              submitButtonRef.current.focus();
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
          placeholder="앨범명을 입력하세요"
        />
      </div>

      {/* 앨범설명 */}
      <div>
        <label className="block text-base font-medium text-gray-900 mb-2">
          앨범설명
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onFormDataChange("description", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006FFF] resize-none"
          rows={2}
          placeholder="앨범 설명을 입력하세요"
        />
      </div>

      {/* 공개설정 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-base font-medium text-gray-900">
            공개설정
          </label>
          <div className="flex items-center gap-3">
            {formData.isPublic ? (
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
              onClick={() => onFormDataChange("isPublic", !formData.isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006FFF] focus:ring-offset-2 ${
                formData.isPublic ? "bg-[#006FFF]" : "bg-gray-300"
              }`}
              role="switch"
              aria-checked={formData.isPublic}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isPublic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-left">
          다른 사용자에게 앨범이 공개되지 않도록 설정할 수 있어요.
        </p>
      </div>

      {/* 곡개수 */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <label className="text-base font-medium text-gray-900 pt-2">
            곡개수
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const newValue = Math.max(0, formData.musicCountLimit - 1);
                onFormDataChange("musicCountLimit", newValue);
                onSongCountInputChange(newValue.toString());
              }}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006FFF] transition-colors"
              aria-label="곡 개수 감소"
            >
              <HiMinus className="w-5 h-5 text-gray-700" />
            </button>
            <input
              type="text"
              inputMode="numeric"
              value={songCountInput}
              onChange={(e) => handleSongCountChange(e.target.value)}
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value === "" || value === "0") {
                  // 빈 값이거나 0이면 기본값 15로 설정
                  onSongCountInputChange("15");
                  onFormDataChange("musicCountLimit", 15);
                }
              }}
              className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006FFF] text-center"
              placeholder="0"
            />
            <button
              type="button"
              onClick={() => {
                const newValue = formData.musicCountLimit + 1;
                onFormDataChange("musicCountLimit", newValue);
                onSongCountInputChange(newValue.toString());
              }}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006FFF] transition-colors"
              aria-label="곡 개수 증가"
            >
              <HiPlus className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* 앨범 색상 */}
      <div>
        <label className="block text-base font-medium text-gray-900 mb-2">
          앨범 색상
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollColors("left")}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006FFF] transition-colors"
            aria-label="왼쪽으로 스크롤"
          >
            <HiChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div
            ref={colorScrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide flex-nowrap flex-1 py-2 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                data-color={color}
                onClick={() => onFormDataChange("color", color)}
                className={`flex-shrink-0 w-12 h-12 rounded-xl shadow-md border-2 transition-all duration-200 hover:shadow-lg hover:scale-110 ${
                  formData.color === color
                    ? "border-[#006FFF] ring-2 ring-[#006FFF] ring-offset-2"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`색상 선택: ${color}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollColors("right")}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006FFF] transition-colors"
            aria-label="오른쪽으로 스크롤"
          >
            <HiChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </>
  );
}
