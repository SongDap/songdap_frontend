"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/lib/routes";
import AlbumFormFields, { type AlbumFormData } from "./AlbumFormFields";

type CreateAlbumFormProps = {
  albumColor?: string;
  onAlbumColorChange?: (color: string) => void;
};

export default function CreateAlbumForm({ 
  albumColor: initialAlbumColor = "#808080",
  onAlbumColorChange,
}: CreateAlbumFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AlbumFormData>({
    title: "",
    description: "",
    isPublic: true,
    musicCountLimit: 15,
    color: initialAlbumColor,
  });

  const [songCountInput, setSongCountInput] = useState<string>("15");
  const colorScrollRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // initialAlbumColor가 변경되면 formData.color도 업데이트
  useEffect(() => {
    setFormData((prev) => ({ ...prev, color: initialAlbumColor }));
  }, [initialAlbumColor]);

  useEffect(() => {
    if (onAlbumColorChange) {
      onAlbumColorChange(formData.color);
    }
  }, [formData.color, onAlbumColorChange]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 앨범 생성 API 호출
    
    // 앨범 데이터를 sessionStorage에 저장
    sessionStorage.setItem("albumCreateData", JSON.stringify(formData));
    
    // 앨범 공유 페이지로 이동
    router.push(ROUTES.ALBUM.SHARE);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <AlbumFormFields
        formData={formData}
        onFormDataChange={handleChange}
        songCountInput={songCountInput}
        onSongCountInputChange={setSongCountInput}
        colorScrollRef={colorScrollRef}
        submitButtonRef={submitButtonRef}
      />

      {/* 완료 버튼 */}
      <div className="pt-6">
        <button
          ref={submitButtonRef}
          type="submit"
          className="w-full py-3 px-4 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] active:bg-[#0044AA] focus:outline-none transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!formData.title.trim()}
        >
          완료
        </button>
      </div>
    </form>
  );
}
