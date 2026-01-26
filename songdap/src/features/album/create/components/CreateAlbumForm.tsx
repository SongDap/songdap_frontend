"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/lib/routes";
import AlbumFormFields, { type AlbumFormData } from "./AlbumFormFields";
import { createAlbum } from "@/features/album/api";
import type { AxiosError } from "axios";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // 필수 필드 검증 (not null)
    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    
    if (!trimmedTitle) {
      alert("앨범 제목을 입력해주세요.");
      return;
    }
    
    if (!trimmedDescription) {
      alert("앨범 설명을 입력해주세요.");
      return;
    }
    
    if (!formData.color) {
      alert("앨범 커버 색상을 선택해주세요.");
      return;
    }
    
    // isPublic은 boolean이므로 항상 값이 있음 (검증 불필요)

    setIsSubmitting(true);

    try {
      // 앨범 생성 API 호출
      // musicCountLimit이 0이면 기본값 15로 설정
      const musicCountLimit = formData.musicCountLimit > 0 ? formData.musicCountLimit : 15;
      
      const albumData = {
        title: trimmedTitle,
        description: trimmedDescription,
        isPublic: formData.isPublic,
        musicCountLimit: musicCountLimit,
        color: formData.color,
      };

      console.log("[Album Form] 전송 데이터:", albumData);

      const createdAlbum = await createAlbum(albumData);
      
      console.log("[Album Form] 생성된 앨범 응답:", createdAlbum);
      
      // 새로운 API 응답 구조: data.uuid가 반드시 있음
      const albumUuid = createdAlbum?.uuid;
      
      if (!albumUuid) {
        throw new Error("앨범 UUID를 받을 수 없습니다.");
      }
      
      console.log("[Album Form] 앨범 UUID:", albumUuid);
      
      // 공유 페이지로 이동 (UUID로 API 조회 가능)
      router.push(`${ROUTES.ALBUM.SHARE}?albumId=${albumUuid}`);
    } catch (error) {
      console.error("[Album] 앨범 생성 실패:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // 앨범 생성은 성공했지만 UUID를 받을 수 없는 경우
      if (errorMessage.includes("앨범 생성은 성공했지만") || errorMessage.includes("앨범 UUID가 없습니다")) {
        alert("앨범이 생성되었습니다. 앨범 목록에서 확인해주세요.");
        router.push(ROUTES.ALBUM.LIST);
        return;
      }
      
      const axiosError = error as AxiosError;
      let userErrorMessage = "앨범 생성에 실패했습니다. 잠시 후 다시 시도해주세요.";
      
      if (axiosError.response) {
        // HTTP 에러 응답이 있는 경우
        const status = axiosError.response.status;
        const data = axiosError.response.data as any;
        
        if (status === 401) {
          userErrorMessage = "로그인이 필요합니다. 로그인 후 다시 시도해주세요.";
        } else if (status === 400) {
          userErrorMessage = data?.message || "입력한 정보를 확인해주세요.";
        } else if (status === 500) {
          userErrorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else {
          userErrorMessage = data?.message || userErrorMessage;
        }
      } else if (axiosError.code === 'ERR_NETWORK' || axiosError.message?.includes('Network Error')) {
        userErrorMessage = "네트워크 연결을 확인해주세요. 백엔드 서버가 실행 중인지 확인해주세요.";
      }
      
      alert(userErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={!formData.title.trim() || !formData.description.trim() || !formData.color || isSubmitting}
        >
          {isSubmitting ? "생성 중..." : "완료"}
        </button>
      </div>
    </form>
  );
}
