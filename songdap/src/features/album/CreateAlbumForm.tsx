"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlbumArea, AlbumButtonSection, AlbumInputSection, AlbumInputSectionStep2, AlbumInputSectionStep3, AlbumInputSectionStep4, AlbumShareSection } from "@/features/album/create";
import { COLORS, FONTS, responsive, ALBUM_AREA } from "@/features/album/create/constants";
import { ROUTES } from "@/app/lib/routes";

// 제목 관련 상수
const TITLE_TEXT_STEP1 = "앨범의 제목과 설명을";
const TITLE_SUBTEXT_STEP1 = "알려주세요~";
const TITLE_TEXT_STEP2 = "앨범 카테고리를";
const TITLE_SUBTEXT_STEP2 = "만들어 주세요~";
const TITLE_TEXT_STEP3 = "앨범의 세부 정보를";
const TITLE_SUBTEXT_STEP3 = "입력해주세요~";
const TITLE_TEXT_STEP4 = "앨범 커버를";
const TITLE_SUBTEXT_STEP4 = "만들어주세요~";
const TITLE_TEXT_STEP5 = "발매한 앨범을";
const TITLE_SUBTEXT_STEP5 = "공유해주세요~";
const TITLE_SPACING = 40; // 제목과 앨범 영역 간격
const INPUT_SECTION_SPACING = 20; // 앨범 영역과 입력 섹션 간격

// 폰트 크기 계산 상수
const TARGET_WIDTH_RATIO = 0.7;
const MIN_FONT_SIZE = 30;
const MAX_FONT_SIZE = 100;
const FONT_SIZE_ITERATIONS = 30;
const FONT_SIZE_TOLERANCE = 1;

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
  const [titleFontSize, setTitleFontSize] = useState(60);
  const [titleHeight, setTitleHeight] = useState(0);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const serviceFrameRef = useRef<HTMLDivElement>(null);
  const isButtonEnabled = albumName.trim().length > 0;

  // step에 따른 제목 텍스트
  const titleText = step === 1 ? TITLE_TEXT_STEP1 : step === 2 ? TITLE_TEXT_STEP2 : step === 3 ? TITLE_TEXT_STEP3 : step === 4 ? TITLE_TEXT_STEP4 : TITLE_TEXT_STEP5;
  const titleSubtext = step === 1 ? TITLE_SUBTEXT_STEP1 : step === 2 ? TITLE_SUBTEXT_STEP2 : step === 3 ? TITLE_SUBTEXT_STEP3 : step === 4 ? TITLE_SUBTEXT_STEP4 : TITLE_SUBTEXT_STEP5;

  useEffect(() => {
    const updateFontSize = () => {
      if (!serviceFrameRef.current) return;
      
      // 가장 긴 텍스트를 기준으로 폰트 크기 계산 (모든 step에서 동일한 크기 유지)
      const longestText = Math.max(
        TITLE_TEXT_STEP1.length,
        TITLE_TEXT_STEP2.length,
        TITLE_TEXT_STEP3.length,
        TITLE_TEXT_STEP4.length,
        TITLE_TEXT_STEP5.length
      );
      const baseText = longestText === TITLE_TEXT_STEP1.length ? TITLE_TEXT_STEP1 :
                       longestText === TITLE_TEXT_STEP2.length ? TITLE_TEXT_STEP2 :
                       longestText === TITLE_TEXT_STEP3.length ? TITLE_TEXT_STEP3 :
                       longestText === TITLE_TEXT_STEP4.length ? TITLE_TEXT_STEP4 :
                       TITLE_TEXT_STEP5;
      
      const targetWidth = serviceFrameRef.current.offsetWidth * TARGET_WIDTH_RATIO;
      const tempElement = document.createElement('div');
      Object.assign(tempElement.style, {
        position: 'absolute',
        visibility: 'hidden',
        whiteSpace: 'nowrap',
        fontFamily: FONTS.DUNG_GEUN_MO,
        fontWeight: '900',
      });
      tempElement.textContent = baseText;
      document.body.appendChild(tempElement);
      
      let fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, (targetWidth / baseText.length) * 1.2));
      let step = fontSize / 4;
      let direction = 1;
      
      for (let i = 0; i < FONT_SIZE_ITERATIONS; i++) {
        tempElement.style.fontSize = `${fontSize}px`;
        const textWidth = tempElement.offsetWidth;
        
        if (Math.abs(textWidth - targetWidth) < FONT_SIZE_TOLERANCE) break;
        
        if (textWidth < targetWidth) {
          if (direction === -1) step /= 2;
          direction = 1;
          fontSize += step;
        } else {
          if (direction === 1) step /= 2;
          direction = -1;
          fontSize -= step;
        }
        
        fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, fontSize));
        if (step < 0.1) break;
      }
      
      document.body.removeChild(tempElement);
      setTitleFontSize(Math.round(fontSize));
      
      // 제목 높이 측정
      if (titleRef.current) {
        setTitleHeight(titleRef.current.offsetHeight);
      }
    };

    const updateTitleHeight = () => {
      if (titleRef.current) {
        setTitleHeight(titleRef.current.offsetHeight);
      }
    };

    const handleResize = () => {
      updateFontSize();
      updateTitleHeight();
    };

    const timeoutId = setTimeout(handleResize, 0);
    
    const resizeObserver = new ResizeObserver(handleResize);
    
    if (serviceFrameRef.current) {
      resizeObserver.observe(serviceFrameRef.current);
    }
    if (titleRef.current) {
      resizeObserver.observe(titleRef.current);
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [step, titleText]);

  // 앨범 영역 top 위치 계산
  const albumAreaTop = titleHeight > 0 
    ? `calc(max(80px, calc(100 * 100vh / 1024)) + ${titleHeight}px + ${responsive.vh(TITLE_SPACING)})`
    : 'calc(226 * max(700px, 100vh) / 1024)';

  // 입력 섹션 top 위치 계산
  const inputSectionTop = titleHeight > 0 
    ? `calc(max(80px, calc(100 * 100vh / 1024)) + ${titleHeight}px + ${responsive.vh(TITLE_SPACING)} + ${ALBUM_AREA.HEIGHT} + ${responsive.vh(INPUT_SECTION_SPACING)})`
    : `calc(226 * max(700px, 100vh) / 1024 + ${ALBUM_AREA.HEIGHT} + ${responsive.vh(INPUT_SECTION_SPACING)})`;

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center p-4">
      <div 
        ref={serviceFrameRef}
        className="bg-[#fefaf0] relative service-frame service-frame-scroll"
        style={{
          width: 'min(clamp(100vw, calc(768 * 100vw / 1820), 900px), 900px)',
          maxWidth: '100%',
        }}
      >
        <div 
          ref={titleRef}
          className="absolute font-black album-create-title"
          style={{
            fontFamily: FONTS.DUNG_GEUN_MO,
            left: 'min(calc(32 * 100% / 768), 32px)',
            top: 'max(80px, calc(100 * 100vh / 1024))',
            fontSize: `${titleFontSize}px`,
            lineHeight: '1.2',
            color: COLORS.BLACK,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          <div>{titleText}</div>
          <div>{titleSubtext}</div>
        </div>
        
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: albumAreaTop,
            width: '100%',
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
            position: 'absolute',
            left: '0',
            top: inputSectionTop,
            bottom: responsive.vh(144),
            width: '100%',
            paddingLeft: 'min(calc(32 * 100% / 768), 32px)',
            paddingRight: 'min(calc(32 * 100% / 768), 32px)',
            boxSizing: 'border-box',
            overflowY: 'auto',
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
        
        <div
          style={{
            position: 'absolute',
            left: '0',
            bottom: '0',
            width: '100%',
          }}
        >
          <AlbumButtonSection
            onNextClick={() => {
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
                // 발매 확인 모달 열기
                setIsReleaseModalOpen(true);
              } else if (step === 5) {
                // 완료 버튼 클릭 시 앨범 저장소 페이지로 이동
                router.push(ROUTES.ALBUM.BASE);
              } else {
                // TODO: 앨범 생성 로직 구현
                console.log('앨범 생성');
              }
            }}
            onPrevClick={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                // TODO: 이전 페이지로 이동 로직 구현
                console.log('이전 페이지로 이동');
              }
            }}
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
                onClick={() => {
                  // 앨범 발매 후 공유 페이지로 이동
                  setStep(5);
                  setIsReleaseModalOpen(false);
                }}
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

