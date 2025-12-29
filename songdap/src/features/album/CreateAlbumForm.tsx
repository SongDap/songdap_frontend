"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlbumArea, AlbumButtonSection, AlbumInputSection, AlbumInputSectionStep2, AlbumInputSectionStep3, AlbumInputSectionStep4, AlbumShareSection } from "@/features/album/create";
import { COLORS, FONTS, responsive, TEXT_SIZES } from "@/features/album/create/constants";
import { ROUTES } from "@/app/lib/routes";

const TITLE_TEXTS = [
  { main: "앨범의 제목과 설명을", sub: "알려주세요~" },
  { main: "앨범 카테고리를", sub: "만들어 주세요~" },
  { main: "앨범의 세부 정보를", sub: "입력해주세요~" },
  { main: "앨범 커버를", sub: "만들어주세요~" },
  { main: "발매한 앨범을", sub: "공유해주세요~" },
] as const;

const TITLE_SPACING = 40;
const INPUT_SECTION_SPACING = 20;

// 스타일 상수
const serviceFrameStyle = {
  width: 'min(clamp(100vw, calc(768 * 100vw / 1820), 900px), 900px)',
  maxWidth: '100%',
  display: 'flex' as const,
  flexDirection: 'column' as const,
};

const titleStyle = {
  fontFamily: FONTS.DUNG_GEUN_MO,
  paddingLeft: 'min(calc(32 * 100% / 768), 32px)',
  paddingRight: 'min(calc(32 * 100% / 768), 32px)',
  paddingTop: 'max(80px, calc(100 * 100vh / 1024))',
  fontSize: TEXT_SIZES.TITLE,
  lineHeight: '1.2',
  color: COLORS.BLACK,
  wordBreak: 'break-word' as const,
  overflowWrap: 'break-word' as const,
  whiteSpace: 'normal' as const,
  flexShrink: 0,
};

const scrollContainerStyle = {
  flex: 1,
  overflowY: 'auto' as const,
  minHeight: 0,
  display: 'flex' as const,
  flexDirection: 'column' as const,
  justifyContent: 'center' as const,
};

const albumAreaWrapperStyle = {
  paddingTop: `clamp(10px, calc(${TITLE_SPACING} * 100vh / 1024 * 0.5), ${TITLE_SPACING * 0.5}px)`,
  marginBottom: `clamp(10px, calc(${INPUT_SECTION_SPACING} * 100vh / 1024), ${INPUT_SECTION_SPACING}px)`,
};

const inputSectionStyle = {
  paddingTop: 0,
  paddingBottom: `clamp(12px, calc(24 * 100vh / 1024), 24px)`,
  paddingLeft: 'min(calc(32 * 100% / 768), 32px)',
  paddingRight: 'min(calc(32 * 100% / 768), 32px)',
  boxSizing: 'border-box' as const,
};

const buttonSectionStyle = {
  position: 'sticky' as const,
  bottom: 0,
  left: '0',
  width: '100%',
  backgroundColor: COLORS.BACKGROUND,
  zIndex: 10,
  flexShrink: 0,
};

/**
 * 앨범 발매 확인 모달 컴포넌트
 * 
 * @description step 5에서 "다음" 버튼 클릭 시 표시되는 최종 확인 모달
 */
function ReleaseConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean; 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  const overlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  };

  const modalStyle = {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: COLORS.WHITE,
    border: "3px solid #000",
    borderRadius: "20px",
    padding: `${responsive.vh(30)} 16px`,
    zIndex: 1001,
    width: "clamp(320px, 60vw, 520px)",
  };

  const buttonStyle = {
    flex: 1,
    padding: responsive.vh(15),
    border: "3px solid #000000",
    borderRadius: "10px",
    cursor: "pointer" as const,
    fontFamily: FONTS.CAFE24_PROSLIM,
    fontSize: responsive.vh(25),
    color: COLORS.BLACK,
  };

  return (
    <>
      <div onClick={onCancel} style={overlayStyle} />
      <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <div style={{ marginBottom: responsive.vh(30), textAlign: "center" as const }}>
          <div style={{
            fontFamily: FONTS.CAFE24_PROSLIM,
            fontSize: responsive.vh(30),
            color: COLORS.BLACK,
            marginBottom: responsive.vh(10),
          }}>
            앨범을 발매하시겠습니까?
          </div>
        </div>
        <div style={{ display: "flex", gap: responsive.vh(15) }}>
          <button
            onClick={onCancel}
            style={{ ...buttonStyle, backgroundColor: COLORS.BACKGROUND }}
          >
            아니오
          </button>
          <button
            onClick={onConfirm}
            style={{ ...buttonStyle, backgroundColor: COLORS.BUTTON_ENABLED_OUTER }}
          >
            예
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * 앨범 생성 메인 컴포넌트
 * 
 * @description
 * 5단계 앨범 생성 프로세스 관리
 * - step 1: 앨범 제목 & 설명
 * - step 2: 카테고리 선택 (기분/상황)
 * - step 3: 공개 여부 & 곡 개수
 * - step 4: 앨범 커버 & LP 디자인
 * - step 5: 최종 미리보기 & 공유
 */
export default function CreateAlbumForm() {
  const router = useRouter();
  const serviceFrameRef = useRef<HTMLDivElement>(null);

  // ==================== 상태 관리 ====================
  
  // 단계 관리
  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);

  // 앨범 기본 정보
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [situationValue, setSituationValue] = useState("");
  const [isPublic, setIsPublic] = useState("public");
  const [songCount, setSongCount] = useState(15);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);

  // 앨범 커버 & LP 디자인
  const [coverColor, setCoverColor] = useState("#ffffff");
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(undefined);
  const [lpColor, setLpColor] = useState("#ffffff");
  const [lpCircleImageUrl, setLpCircleImageUrl] = useState<string | undefined>(undefined);
  const [isSyncEnabled, setIsSyncEnabled] = useState(false);
  const [syncSource, setSyncSource] = useState<"cover" | "lp" | null>(null);

  // ==================== 동기화 처리 ====================
  
  /**
   * 앨범 커버와 LP 디자인 동기화
   * syncSource에 따라 커버→LP 또는 LP→커버로 동기화
   */
  useEffect(() => {
    if (!isSyncEnabled || !syncSource) return;

    const sourceColor = syncSource === "cover" ? coverColor : lpColor;
    const sourceImage = syncSource === "cover" ? coverImageUrl : lpCircleImageUrl;

    if (coverColor !== sourceColor) setCoverColor(sourceColor);
    if (lpColor !== sourceColor) setLpColor(sourceColor);
    if (coverImageUrl !== sourceImage) setCoverImageUrl(sourceImage);
    if (lpCircleImageUrl !== sourceImage) setLpCircleImageUrl(sourceImage);
  }, [isSyncEnabled, syncSource, coverColor, coverImageUrl, lpColor, lpCircleImageUrl]);

  // ==================== 이벤트 핸들러 ====================
  
  const handleSyncChange = (enabled: boolean, source: "cover" | "lp") => {
    setIsSyncEnabled(enabled);
    setSyncSource(enabled ? source : null);
  };

  const goToStep = (target: number) => {
    setStep(target);
    setMaxStepReached((prev) => Math.max(prev, target));
  };

  const handleNextClick = () => {
    if (step < 4) {
      goToStep(step + 1);
    } else if (step === 4) {
      setIsReleaseModalOpen(true);
    } else if (step === 5) {
      router.push(ROUTES.ALBUM.BASE);
    }
  };

  const handlePrevClick = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleReleaseConfirm = () => {
    setStep(5);
    setIsReleaseModalOpen(false);
  };

  // 계산된 값
  const currentTitle = TITLE_TEXTS[step - 1] || TITLE_TEXTS[0];
  const isButtonEnabled = albumName.trim().length > 0;
  const nextButtonText = step === 4 ? "발매" : step === 5 ? "완료" : "다음";

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center p-4">
      <div 
        ref={serviceFrameRef}
        className="bg-[#fefaf0] relative service-frame service-frame-scroll"
        style={serviceFrameStyle}
      >
        <div className="font-black album-create-title" style={titleStyle}>
          <div>{currentTitle.main}</div>
          <div>{currentTitle.sub}</div>
        </div>
        
        <div style={scrollContainerStyle}>
          <div style={albumAreaWrapperStyle}>
          <AlbumArea 
            albumName={albumName} 
            albumDescription={albumDescription}
            category={category}
            selectedTag={selectedTag}
            situationValue={situationValue}
            isPublic={isPublic}
            songCount={songCount}
            step={step}
            maxStepReached={maxStepReached}
              lpColor={isSyncEnabled ? coverColor : lpColor}
              lpCircleImageUrl={isSyncEnabled ? coverImageUrl : lpCircleImageUrl}
            coverColor={coverColor}
            coverImageUrl={coverImageUrl}
              profileImageUrl={profileImageUrl}
          />
        </div>
        
          <div style={inputSectionStyle}>
            {step === 1 && (
            <AlbumInputSection
              albumName={albumName}
              albumDescription={albumDescription}
              onAlbumNameChange={setAlbumName}
              onAlbumDescriptionChange={setAlbumDescription}
            />
            )}
            {step === 2 && (
            <AlbumInputSectionStep2
              category={category}
              onCategoryChange={setCategory}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              situationValue={situationValue}
              onSituationChange={setSituationValue}
            />
            )}
            {step === 3 && (
            <AlbumInputSectionStep3
              isPublic={isPublic}
              onPublicChange={setIsPublic}
              songCount={songCount}
              onSongCountChange={setSongCount}
            />
            )}
            {step === 4 && (
            <AlbumInputSectionStep4
              lpColor={lpColor}
              onLpColorChange={setLpColor}
                lpCircleImageUrl={lpCircleImageUrl}
                onLpCircleImageUrlChange={setLpCircleImageUrl}
                coverColor={coverColor}
                onCoverColorChange={setCoverColor}
              coverImageUrl={coverImageUrl}
              onCoverImageUrlChange={setCoverImageUrl}
                isSyncEnabled={isSyncEnabled}
                onSyncEnabledChange={handleSyncChange}
            />
          )}
            {step === 5 && <AlbumShareSection />}
          </div>
        </div>
        
        <div style={buttonSectionStyle}>
          <AlbumButtonSection
            onNextClick={handleNextClick}
            onPrevClick={handlePrevClick}
            nextDisabled={step === 1 && !isButtonEnabled}
            nextText={nextButtonText}
          />
        </div>
      </div>

      <ReleaseConfirmModal
        isOpen={isReleaseModalOpen}
        onConfirm={handleReleaseConfirm}
        onCancel={() => setIsReleaseModalOpen(false)}
      />
    </div>
  );
}

