"use client";
import { useState, useEffect, useRef } from "react";
import { HiLockOpen, HiLockClosed } from "react-icons/hi";
import { HiMinus, HiPlus, HiChevronLeft, HiChevronRight } from "react-icons/hi";

type CreateAlbumFormProps = {
  albumColor?: string;
  onAlbumColorChange?: (color: string) => void;
};

export default function CreateAlbumForm({ 
  albumColor: initialAlbumColor = "#808080",
  onAlbumColorChange 
}: CreateAlbumFormProps) {
  const [formData, setFormData] = useState({
    albumName: "",
    albumDescription: "",
    isPublic: true,
    songCount: 15,
    albumColor: initialAlbumColor,
  });

  useEffect(() => {
    if (onAlbumColorChange) {
      onAlbumColorChange(formData.albumColor);
    }
  }, [formData.albumColor, onAlbumColorChange]);

  // 선택된 색상으로 스크롤
  useEffect(() => {
    if (colorScrollRef.current) {
      const selectedButton = colorScrollRef.current.querySelector(
        `[data-color="${formData.albumColor}"]`
      ) as HTMLElement;
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [formData.albumColor]);

  const [songCountInput, setSongCountInput] = useState<string>("15");
  const colorScrollRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // 미리 정의된 색상 팔레트
  const presetColors = [
    "#00c7fc",
    "#3a88fe",
    "#5e30eb",
    "#d357fe",
    "#ed719e",
    "#ff6251",
    "#ff8647",
    "#ffb43f",
    "#fecb3e",
    "#FFD93D",
    "#e4ef65",
    "#96d35f",
    "#929292",
  ];

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const scrollColors = (direction: "left" | "right") => {
    if (colorScrollRef.current) {
      const scrollAmount = 200; // 한 번에 스크롤할 픽셀 수
      colorScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <form className="mt-8 space-y-6">
      {/* 앨범명 */}
      <div>
        <label className="block text-base font-medium text-gray-900 mb-2">
          앨범명
        </label>
        <input
          type="text"
          value={formData.albumName}
          onChange={(e) => handleChange("albumName", e.target.value)}
          onBlur={(e) => {
            // 앨범명이 입력되어 있으면 만들기 버튼으로 포커스 이동
            if (formData.albumName.trim() && submitButtonRef.current) {
              setTimeout(() => {
                submitButtonRef.current?.focus();
              }, 0);
            }
          }}
          onKeyDown={(e) => {
            // Enter 키를 누르면 만들기 버튼으로 포커스 이동
            if (e.key === "Enter" && formData.albumName.trim() && submitButtonRef.current) {
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
          value={formData.albumDescription}
          onChange={(e) => handleChange("albumDescription", e.target.value)}
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
              onClick={() => handleChange("isPublic", !formData.isPublic)}
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
              const newValue = Math.max(0, formData.songCount - 1);
              handleChange("songCount", newValue);
              setSongCountInput(newValue.toString());
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
            onChange={(e) => {
              const value = e.target.value;
              // 빈 문자열 허용
              if (value === "") {
                setSongCountInput("");
                handleChange("songCount", 0);
                return;
              }
              // 숫자만 허용
              if (/^\d+$/.test(value)) {
                setSongCountInput(value);
                const numValue = parseInt(value, 10);
                if (!isNaN(numValue)) {
                  handleChange("songCount", numValue);
                }
              }
            }}
            onBlur={(e) => {
              // 포커스를 잃었을 때 빈 값이면 0으로 설정
              if (e.target.value === "") {
                setSongCountInput("0");
                handleChange("songCount", 0);
              }
            }}
            className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006FFF] text-center"
            placeholder="0"
          />
          <button
            type="button"
            onClick={() => {
              const newValue = formData.songCount + 1;
              handleChange("songCount", newValue);
              setSongCountInput(newValue.toString());
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
        {/* 색상 팔레트 */}
        <div className="flex items-center gap-2">
          {/* 왼쪽 화살표 */}
          <button
            type="button"
            onClick={() => scrollColors("left")}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#006FFF] transition-colors"
            aria-label="왼쪽으로 스크롤"
          >
            <HiChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* 스크롤 가능한 색상 리스트 */}
          <div
            ref={colorScrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide flex-nowrap flex-1 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                data-color={color}
                onClick={() => handleChange("albumColor", color)}
                className={`flex-shrink-0 w-12 h-12 rounded-xl shadow-md border-2 transition-all duration-200 hover:shadow-lg hover:scale-110 ${
                  formData.albumColor === color
                    ? "border-[#006FFF] ring-2 ring-[#006FFF] ring-offset-2"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`색상 선택: ${color}`}
              />
            ))}
          </div>

          {/* 오른쪽 화살표 */}
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

      {/* 만들기 버튼 */}
      <div className="pt-6">
        <button
          ref={submitButtonRef}
          type="submit"
          className="w-full py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!formData.albumName.trim()}
        >
          만들기
        </button>
      </div>
    </form>
  );
}
