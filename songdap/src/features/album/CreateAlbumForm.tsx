"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlbumArea, AlbumButtonSection, AlbumInputSection, AlbumInputSectionStep2, AlbumInputSectionStep3, AlbumInputSectionStep4, AlbumShareSection } from "@/features/album/create";
import { COLORS, FONTS, responsive, TEXT_SIZES } from "@/features/album/create/constants";
import { ROUTES } from "@/app/lib/routes";

// 제목 관련 상수
const TITLE_TEXTS = [
  { main: "앨범의 제목과 설명을", sub: "알려주세요~" },
  { main: "앨범 카테고리를", sub: "만들어 주세요~" },
  { main: "앨범의 세부 정보를", sub: "입력해주세요~" },
  { main: "앨범 커버를", sub: "만들어주세요~" },
  { main: "발매한 앨범을", sub: "공유해주세요~" },
] as const;

const TITLE_SPACING = 40;
const INPUT_SECTION_SPACING = 20;


export default function CreateAlbumForm() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 단계 관리
  const [maxStepReached, setMaxStepReached] = useState(1); // 도달한 최대 단계
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [situationValue, setSituationValue] = useState("");
  const [isPublic, setIsPublic] = useState("public");
  const [songCount, setSongCount] = useState(15);
  const [lpColor, setLpColor] = useState("#ffffff");
  const [coverColor, setCoverColor] = useState("#ffffff");
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(undefined);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const serviceFrameRef = useRef<HTMLDivElement>(null);
  const isButtonEnabled = albumName.trim().length > 0;

  // step에 따른 제목 텍스트
  const currentTitle = TITLE_TEXTS[step - 1] || TITLE_TEXTS[0];
  const titleText = currentTitle.main;
  const titleSubtext = currentTitle.sub;

  // 다음 버튼 핸들러
  const handleNextClick = () => {
    if (step === 1) {
      setStep(2);
      setMaxStepReached(Math.max(maxStepReached, 2));
    } else if (step === 2) {
      setStep(3);
      setMaxStepReached(Math.max(maxStepReached, 3));
    } else if (step === 3) {
      setStep(4);
      setMaxStepReached(4);
    } else if (step === 4) {
      setIsReleaseModalOpen(true);
    } else if (step === 5) {
      router.push(ROUTES.ALBUM.BASE);
    }
  };

  // 이전 버튼 핸들러
  const handlePrevClick = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // 모달 닫기 핸들러
  const handleReleaseConfirm = () => {
    setStep(5);
    setIsReleaseModalOpen(false);
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center p-4">
      <div 
        ref={serviceFrameRef}
        className="bg-[#fefaf0] relative service-frame service-frame-scroll"
        style={{
          width: 'min(clamp(100vw, calc(768 * 100vw / 1820), 900px), 900px)',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div 
          className="font-black album-create-title"
          style={{
            fontFamily: FONTS.DUNG_GEUN_MO,
            paddingLeft: 'min(calc(32 * 100% / 768), 32px)',
            paddingRight: 'min(calc(32 * 100% / 768), 32px)',
            paddingTop: 'max(80px, calc(100 * 100vh / 1024))',
            fontSize: TEXT_SIZES.TITLE,
            lineHeight: '1.2',
            color: COLORS.BLACK,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
            flexShrink: 0,
          }}
        >
          <div>{titleText}</div>
          <div>{titleSubtext}</div>
        </div>
        
        {/* 스크롤 가능한 컨테이너: 앨범 영역 + 입력 섹션 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              paddingTop: `clamp(10px, calc(${TITLE_SPACING} * 100vh / 1024 * 0.5), ${TITLE_SPACING * 0.5}px)`,
              marginBottom: `clamp(10px, calc(${INPUT_SECTION_SPACING} * 100vh / 1024), ${INPUT_SECTION_SPACING}px)`,
            }}
          >
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
              lpColor={lpColor}
              coverColor={coverColor}
              coverImageUrl={coverImageUrl}
            />
          </div>
          
          <div
            style={{
              paddingTop: 0,
              paddingBottom: `clamp(12px, calc(24 * 100vh / 1024), 24px)`,
              paddingLeft: 'min(calc(32 * 100% / 768), 32px)',
              paddingRight: 'min(calc(32 * 100% / 768), 32px)',
              boxSizing: 'border-box',
            }}
          >
            {step === 1 ? (
              <AlbumInputSection
                albumName={albumName}
                albumDescription={albumDescription}
                onAlbumNameChange={setAlbumName}
                onAlbumDescriptionChange={setAlbumDescription}
              />
            ) : step === 2 ? (
              <AlbumInputSectionStep2
                category={category}
                onCategoryChange={setCategory}
                selectedTag={selectedTag}
                onTagChange={setSelectedTag}
                situationValue={situationValue}
                onSituationChange={setSituationValue}
              />
            ) : step === 3 ? (
              <AlbumInputSectionStep3
                isPublic={isPublic}
                onPublicChange={setIsPublic}
                songCount={songCount}
                onSongCountChange={setSongCount}
              />
            ) : step === 4 ? (
              <AlbumInputSectionStep4
                lpColor={lpColor}
                onLpColorChange={setLpColor}
                coverImageUrl={coverImageUrl}
                onCoverImageUrlChange={setCoverImageUrl}
                onCoverColorChange={setCoverColor}
              />
            ) : (
              <AlbumShareSection />
            )}
          </div>
        </div>
        
        {/* 버튼 영역: 하단 고정 */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            left: '0',
            width: '100%',
            backgroundColor: '#fefaf0',
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          <AlbumButtonSection
            onNextClick={handleNextClick}
            onPrevClick={handlePrevClick}
            nextDisabled={step === 1 && !isButtonEnabled}
            nextText={step === 4 ? "발매" : step === 5 ? "완료" : "다음"}
          />
        </div>
      </div>

      {/* 발매 확인 모달 */}
      {isReleaseModalOpen && (
        <>
          <div
            onClick={() => setIsReleaseModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: COLORS.WHITE,
              border: "3px solid #000",
              borderRadius: "20px",
              padding: responsive.vh(40),
              zIndex: 1001,
              minWidth: responsive.vw(300),
              maxWidth: "90%",
            }}
          >
            <div
              style={{
                marginBottom: responsive.vh(30),
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.vh(30),
                  color: COLORS.BLACK,
                  marginBottom: responsive.vh(10),
                }}
              >
                앨범을 발매하시겠습니까?
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: responsive.vh(15),
              }}
            >
              <button
                onClick={() => setIsReleaseModalOpen(false)}
                style={{
                  flex: 1,
                  padding: responsive.vh(15),
                  border: "3px solid #000000",
                  borderRadius: "10px",
                  backgroundColor: COLORS.BACKGROUND,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.vh(25),
                  color: COLORS.BLACK,
                }}
              >
                아니오
              </button>
              <button
                onClick={handleReleaseConfirm}
                style={{
                  flex: 1,
                  padding: responsive.vh(15),
                  border: "3px solid #000000",
                  borderRadius: "10px",
                  backgroundColor: COLORS.BUTTON_ENABLED_OUTER,
                  cursor: "pointer",
                  fontFamily: FONTS.CAFE24_PROSLIM,
                  fontSize: responsive.vh(25),
                  color: COLORS.BLACK,
                }}
              >
                예
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

